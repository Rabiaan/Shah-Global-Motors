<?php
/**
 * ============================================================================
 * api-core/bootstrap.php
 * ============================================================================
 * Reusable, hardened entry point for any PHP REST API on Apache/cPanel.
 *
 * Drop this alongside the other api-core/ modules into ANY project. It wires:
 *   - Own-domain-only CORS (rejects cross-origin requests)  [requirements #5]
 *   - Security headers (CSP, HSTS, no-Sniff, frame protections)
 *   - Centralized environment loading + configuration constants
 *   - Global exception/error handler with structured JSON + logging   [#6]
 *
 * USAGE (in your endpoint file, FIRST line before any output):
 *     require_once __DIR__ . '/bootstrap.php';
 *
 * The bootstrap handles preflight OPTIONS and rejects unauthorised origins.
 * ============================================================================
 */

declare(strict_types=1);

/* --------------------------------------------------------------------------
 * 1. Environment loading (small, dependency-free .env parser)
 * ------------------------------------------------------------------------ */
if (!function_exists('loadEnvFile')) {
    function loadEnvFile(string $path): void
    {
        if (!is_file($path)) return;
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
            [$key, $value] = explode('=', $line, 2);
            $key   = trim($key);
            $value = trim($value);
            // Strip surrounding quotes
            if (strlen($value) >= 2) {
                $first = $value[0]; $last = $value[strlen($value) - 1];
                if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                    $value = substr($value, 1, -1);
                }
            }
            if (getenv($key) === false) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
    }
}

// Load .env from project root (one level up from api-core/)
loadEnvFile(dirname(__DIR__) . '/.env');

/* --------------------------------------------------------------------------
 * 2. Configuration constants (fail closed with NO insecure defaults)
 * ------------------------------------------------------------------------ */
define('APP_ENV',   getenv('APP_ENV') ?: 'production');
define('APP_DEBUG', filter_var(getenv('APP_DEBUG') ?: 'false', FILTER_VALIDATE_BOOLEAN));
define('APP_URL',   rtrim(getenv('APP_URL') ?: '', '/'));

// DB
define('DB_HOST',     getenv('DB_HOST') ?: 'localhost');
define('DB_NAME',     getenv('DB_NAME') ?: '');
define('DB_USER',     getenv('DB_USER') ?: '');
define('DB_PASS',     getenv('DB_PASS') ?: '');
define('DB_CHARSET',  getenv('DB_CHARSET') ?: 'utf8mb4');

// Security / auth
define('JWT_SECRET',  getenv('JWT_SECRET') ?: '');
define('JWT_ISSUER',  getenv('JWT_ISSUER') ?: 'api');
define('JWT_AUDIENCE',getenv('JWT_AUDIENCE') ?: 'api');
define('JWT_TTL',     (int)(getenv('JWT_TTL_SECONDS') ?: 3600));
define('PW_RESET_TTL',(int)(getenv('PASSWORD_RESET_TTL_SECONDS') ?: 1800)); // 30 min default

// Rate limits
define('RL_WINDOW',   (int)(getenv('RATE_LIMIT_WINDOW_SECONDS') ?: 60));
define('RL_MAX',      (int)(getenv('RATE_LIMIT_MAX_REQUESTS') ?: 120));
define('RL_AUTH_MAX', (int)(getenv('RATE_LIMIT_AUTH_MAX') ?: 10));

// Logging
define('LOG_DIR',     getenv('LOG_DIRECTORY') ?: __DIR__ . '/storage/logs');
define('LOG_LEVEL',   getenv('LOG_LEVEL') ?: 'error');
define('ALERT_URL',   getenv('ALERT_WEBHOOK_URL') ?: '');
define('ALERT_SECRET',getenv('ALERT_WEBHOOK_HMAC_SECRET') ?: '');

/* --------------------------------------------------------------------------
 * 3. JSON response helper (always HTTPS-friendly headers)
 * ------------------------------------------------------------------------ */
if (!function_exists('apiResponse')) {
    function apiResponse(mixed $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}

/* --------------------------------------------------------------------------
 * 4. CORS - serve ONLY requests originating from our own configured domain(s)
 * ------------------------------------------------------------------------ */
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');

// Normalise referer (like https://domain.com/path -> https://domain.com)
if (!$origin && isset($_SERVER['HTTP_REFERER'])) {
    $parts = parse_url($_SERVER['HTTP_REFERER']);
    if ($parts && isset($parts['scheme'], $parts['host'])) {
        $origin = $parts['scheme'] . '://' . $parts['host'];
    }
}

$allowed = array_filter(array_map('trim', explode(',', getenv('ALLOWED_ORIGINS') ?: '')));

function originAllowed(?string $origin, array $allowed): bool
{
    if ($origin === null || $origin === '') return false;
    // Never allow the wildcard
    if (in_array('*', $allowed, true)) return false;
    foreach ($allowed as $a) {
        if ($origin === rtrim($a, '/')) return true;
    }
    return false;
}

$isPreflight = ($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS';

// Reject any browser request that does NOT come from an allowed origin.
// Requests with no Origin/Referer header (CLI, cron, same-server internal calls)
// are permitted; everything else must match ALLOWED_ORIGINS exactly.
if ($origin !== '') {
    if (!originAllowed($origin, $allowed)) {
        apiCoreLog('warning', 'Blocked request from disallowed origin', ['origin' => $origin]);
        apiResponse(['status' => 'error', 'message' => 'Origin not allowed'], 403);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

if ($isPreflight) {
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

/* --------------------------------------------------------------------------
 * 5. Security headers
 * ------------------------------------------------------------------------ */
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header('Content-Security-Policy: default-src \'none\'; frame-ancestors \'none\';');
if (APP_ENV === 'production') {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}

/* --------------------------------------------------------------------------
 * 6. Centralized error / exception handling with logging
 * ------------------------------------------------------------------------ */
if (!function_exists('apiCoreLog')) {
    function apiCoreLog(string $level, string $message, array $context = []): void
    {
        $levels = ['debug' => 0,'info' => 1,'warning' => 2,'error' => 3,'critical' => 4];
        $threshold = $levels[LOG_LEVEL] ?? 3;
        $lvl       = $levels[strtolower($level)] ?? 3;

        // Respect configured severity threshold (log "error" and above by default)
        if ($lvl < $threshold) return;

        $dir = LOG_DIR;
        if (!is_dir($dir)) { @mkdir($dir, 0755, true); }

        $line = sprintf(
            "[%s] %s %s %s\n",
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $message,
            $context ? json_encode($context) : ''
        );
        $file = rtrim($dir, '/') . '/' . date('Y-m-d') . '.log';
        @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);

        // ------------------------------------------------------------------
        // CRITICAL alert: fire a webhook (Slack/Discord/etc.) with HMAC
        // ------------------------------------------------------------------
        if ($lvl >= 4 && ALERT_URL !== '') {
            $payload = json_encode([
                'event'   => 'api.critical',
                'level'   => 'critical',
                'message' => $message,
                'context' => $context,
                'env'     => APP_ENV,
                'host'    => gethostname(),
                'time'    => gmdate(DATE_ATOM),
            ], JSON_UNESCAPED_SLASHES);
            $headers = ['Content-Type: application/json'];
            if (ALERT_SECRET !== '') {
                $hmac = hash_hmac('sha256', $payload, ALERT_SECRET);
                $headers[] = 'X-Signature: ' . $hmac;
            }
            $ch = curl_init(ALERT_URL);
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_HTTPHEADER     => $headers,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 5,
                CURLOPT_CONNECTTIMEOUT => 3,
            ]);
            @curl_exec($ch);
            @curl_close($ch);
        }
    }
}

if (!function_exists('apiCoreErrorHandler')) {
    function apiCoreErrorHandler(int $errno, string $errstr, string $errfile, int $errline): bool
    {
        // Ignore suppressed errors (@)
        if (!(error_reporting() & $errno)) return false;

        apiCoreLog('error', "$errstr in $errfile:$errline", ['errno' => $errno]);
        apiResponse(['status' => 'error', 'message' => 'Internal server error'], 500);
        return true;
    }

    function apiCoreExceptionHandler(Throwable $e): void
    {
        // Uncaught Errors and server errors (500) are always logged as critical
        $isCritical = ($e instanceof Error) || ($e->getCode() >= 500) || (int)$e->getCode() === 0;
        apiCoreLog($isCritical ? 'critical' : 'error',
            $e->getMessage(),
            ['file' => $e->getFile(), 'line' => $e->getLine()]);

        $body = ['status' => 'error', 'message' => 'Internal server error'];
        if (APP_DEBUG) {
            $body['debug'] = ['message' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()];
        }
        apiResponse($body, 500);
    }
}

set_error_handler('apiCoreErrorHandler');
set_exception_handler('apiCoreExceptionHandler');

/* --------------------------------------------------------------------------
 * 7. Safe input helpers
 * ------------------------------------------------------------------------ */
if (!function_exists('jsonInput')) {
    function jsonInput(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw ?: '', true);
        return is_array($data) ? $data : [];
    }
}

if (!function_exists('clientIP')) {
    function clientIP(): string
    {
        // Respect trusted proxy headers safely (do not trust client-supplied XFF blindly)
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) { // Cloudflare
            $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
        } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = trim($parts[0]);
        }
        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
    }
}
