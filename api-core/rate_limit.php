<?php
/**
 * ============================================================================
 * api-core/rate_limit.php
 * ============================================================================
 * Sliding-window rate limiter backed by MySQL (works on shared cPanel hosting
 * without Redis).
 *
 * [requirement #6] Every endpoint should call checkRateLimit() early.
 * Auth endpoints use a stricter limit via checkAuthRateLimit().
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/database.php';

if (!function_exists('checkRateLimit')) {
    /**
     * Enforce a sliding-window rate limit keyed by client IP (+ optional scope).
     * Aborts with 429 + Retry-After when exceeded.
     */
    function checkRateLimit(string $scope = 'general', int $max = 0, int $window = 0): void
    {
        $max    = $max    ?: RL_MAX;
        $window = $window ?: RL_WINDOW;

        $bucket = substr(hash('sha256', clientIP() . '|' . $scope), 0, 32);
        $now    = time();

        try {
            $pdo = getDb();
            // Purge expired buckets periodically (cheap, probabilistic)
            if (mt_rand(1, 100) <= 5) {
                $pdo->exec("DELETE FROM rate_limit WHERE window_start < " . ($now - $window));
            }

            $existing = dbRow('SELECT hits, window_start FROM rate_limit WHERE bucket = ? AND scope = ?', [$bucket, $scope]);

            if (!$existing) {
                dbExecute('INSERT INTO rate_limit (bucket, scope, hits, window_start) VALUES (?, ?, 1, ?)', [$bucket, $scope, $now]);
                return;
            }

            $elapsed = $now - (int)$existing['window_start'];
            if ($elapsed >= $window) {
                // New window
                dbExecute('UPDATE rate_limit SET hits = 1, window_start = ? WHERE bucket = ? AND scope = ?', [$now, $bucket, $scope]);
                return;
            }

            $hits = (int)$existing['hits'] + 1;
            if ($hits > $max) {
                $retryAfter = $window - $elapsed;
                apiCoreLog('warning', 'Rate limit exceeded', ['scope' => $scope, 'hits' => $hits]);
                http_response_code(429);
                header('Content-Type: application/json; charset=UTF-8');
                header('Retry-After: ' . $retryAfter);
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'Too many requests. Try again shortly.',
                    'retry_after' => $retryAfter,
                ]);
                exit;
            }

            dbExecute('UPDATE rate_limit SET hits = ? WHERE bucket = ? AND scope = ?', [$hits, $bucket, $scope]);
        } catch (Throwable $e) {
            // Fail OPEN for rate limiting ONLY if the DB is down — never block legit
            // traffic due to limiter infrastructure issues. Log it for visibility.
            apiCoreLog('error', 'Rate limiter error', ['message' => $e->getMessage()]);
        }
    }
}

if (!function_exists('checkAuthRateLimit')) {
    /** Stricter limiter for login / reset endpoints. */
    function checkAuthRateLimit(string $scope = 'auth'): void
    {
        checkRateLimit($scope, RL_AUTH_MAX, RL_WINDOW);
    }
}

if (!function_exists('bruteForceBackoff')) {
    /**
     * Optional: per-account lockout after repeated auth failures.
     * Call after a failed login to record the attempt; call before verifying
     * a password to check the lockout.
     */
    function bruteForceBackoff(string $identifier, bool $check = true): array
    {
        $now = time();
        $bucket = substr(hash('sha256', $identifier), 0, 32);
        if ($check) {
            $row = dbRow('SELECT fails, last_fail FROM auth_failures WHERE bucket = ?', [$bucket]);
            if ($row && (int)$row['fails'] >= 5) {
                $cooldown = 900; // 15 minute lockout
                $since = $now - (int)$row['last_fail'];
                if ($since < $cooldown) {
                    return ['locked' => true, 'retry_after' => $cooldown - $since];
                }
            }
            return ['locked' => false];
        }
        // record failure
        $row = dbRow('SELECT fails, last_fail FROM auth_failures WHERE bucket = ?', [$bucket]);
        if ($row) {
            dbExecute('UPDATE auth_failures SET fails = fails + 1, last_fail = ? WHERE bucket = ?', [$now, $bucket]);
        } else {
            dbExecute('INSERT INTO auth_failures (bucket, fails, last_fail) VALUES (?, 1, ?)', [$bucket, $now]);
        }
        return ['locked' => false];
    }
}
