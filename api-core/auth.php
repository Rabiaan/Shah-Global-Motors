<?php
/**
 * ============================================================================
 * api-core/auth.php
 * ============================================================================
 * Stateless JWT authentication with STRICT per-user (UUID) data scoping.
 *
 * REQUIREMENTS COVERED:
 *   [#1] Every logged-in request resolves to exactly ONE user UUID. All
 *        downstream queries MUST filter by that UUID — see ScopedUser helpers.
 *   [#3] JWT HS256 signed server-side; token bound to a specific user UUID and
 *        session fingerprint.
 *   [#6] Rate limiting for auth endpoints + full logging of failures.
 *
 * The token contains: sub (user UUID), jti (unique token id), session id hash
 * so a token cannot be replayed from a different device/IP.
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/database.php';

/* --------------------------------------------------------------------------
 * JWT encode / decode (HS256) — dependency free
 * ------------------------------------------------------------------------ */
if (!function_exists('base64UrlEncode')) {
    function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }
    function jwtSign(array $header, array $payload): string
    {
        if (JWT_SECRET === '' || strlen(JWT_SECRET) < 32) {
            apiCoreLog('critical', 'JWT_SECRET not configured or too short');
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Server misconfigured']);
            exit;
        }
        $encoding = base64UrlEncode(json_encode($header)) . '.' . base64UrlEncode(json_encode($payload));
        $sig = hash_hmac('sha256', $encoding, JWT_SECRET, true);
        return $encoding . '.' . base64UrlEncode($sig);
    }

    /** Returns payload array, or null if invalid/expired. */
    function jwtVerify(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$headB64, $payloadB64, $sigB64] = $parts;
        $data = $headB64 . '.' . $payloadB64;
        $expected = hash_hmac('sha256', $data, JWT_SECRET, true);
        if (!hash_equals($expected, base64UrlDecode($sigB64))) return null;

        $payload = json_decode(base64UrlDecode($payloadB64), true);
        if (!is_array($payload)) return null;

        // Issuer / audience / expiry checks
        $now = time();
        if (($payload['iss'] ?? '') !== JWT_ISSUER) return null;
        if (($payload['aud'] ?? '') !== JWT_AUDIENCE) return null;
        if (($payload['exp'] ?? 0) < $now) return null;
        if (($payload['nbf'] ?? 0) > $now) return null;

        return $payload;
    }
}

/* --------------------------------------------------------------------------
 * Session fingerprint — binds a token to the originating client
 * ------------------------------------------------------------------------ */
if (!function_exists('sessionFingerprint')) {
    function sessionFingerprint(): string
    {
        $ua  = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $ip  = clientIP();
        return hash('sha256', $ua . '|' . $ip);
    }
}

/* --------------------------------------------------------------------------
 * Issue an access token for a given user record
 * ------------------------------------------------------------------------ */
if (!function_exists('issueToken')) {
    function issueToken(array $userRecord): array
    {
        $now = time();
        $payload = [
            'iss'   => JWT_ISSUER,
            'aud'   => JWT_AUDIENCE,
            'sub'   => $userRecord['uuid'],        // STRICTLY the user UUID
            'jti'   => bin2hex(random_bytes(16)),  // unique token id
            'iat'   => $now,
            'nbf'   => $now,
            'exp'   => $now + JWT_TTL,
            'sid'   => sessionFingerprint(),       // device binding
            'scp'   => $userRecord['role'] ?? 'user',
        ];
        $token = jwtSign(['alg' => 'HS256', 'typ' => 'JWT'], $payload);
        return ['token' => $token, 'expires_in' => JWT_TTL, 'expires_at' => gmdate(DATE_ATOM, $payload['exp'])];
    }
}

/* --------------------------------------------------------------------------
 * requireUser() — gatekeep a protected endpoint.
 * Returns the authenticated user's UUID + payload, or aborts with 401.
 * ------------------------------------------------------------------------ */
if (!function_exists('requireUser')) {
    function requireUser(): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if ($header === '' && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }
        if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
            apiCoreLog('warning', 'Auth: missing bearer token');
            http_response_code(401);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }

        $payload = jwtVerify(trim($m[1]));
        if ($payload === null) {
            apiCoreLog('warning', 'Auth: invalid/expired token');
            http_response_code(401);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }

        // Device binding check — reject token used from a different client
        if (($payload['sid'] ?? '') !== sessionFingerprint()) {
            apiCoreLog('warning', 'Auth: device fingerprint mismatch', ['sub' => $payload['sub'] ?? null]);
            http_response_code(401);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }

        $uuid = $payload['sub'] ?? null;
        if ($uuid === null || !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $uuid)) {
            apiCoreLog('warning', 'Auth: invalid subject UUID', ['sub' => $uuid]);
            http_response_code(401);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit;
        }

        return ['uuid' => $uuid, 'role' => $payload['scp'] ?? 'user', 'payload' => $payload];
    }
}

/* --------------------------------------------------------------------------
 * Scoped helpers — the ONLY sanctioned way endpoints touch user-owned rows.
 * They ALWAYS add a WHERE user_uuid = ? (the authenticated UUID), so one user
 * can never read/write another user's data. [requirement #1]
 * ------------------------------------------------------------------------ */
if (!function_exists('scopedRow')) {
    /** Fetch a row that must belong to $uuid. Returns null if not owned. */
    function scopedRow(string $uuid, string $table, string $idColumn, mixed $idValue): ?array
    {
        // Validate table/id column against an allowlist to prevent key injection
        $allowed = ['vehicles', 'enquiries', 'test_drives', 'sell_requests', 'resumes', 'documents', 'profiles', 'user_notes'];
        if (!in_array($table, $allowed, true)) {
            apiCoreLog('critical', 'scopedRow: disallowed table', ['table' => $table]);
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Request blocked']);
            exit;
        }

        $sql = "SELECT * FROM `$table` WHERE `$idColumn` = ? AND `user_uuid` = ? LIMIT 1";
        // NOTE: `$idColumn` is validated by an explicit allowlist below.
        $colAllow = ['id','uuid','vehicle_id','listing_id','doc_id'];
        if (!in_array($idColumn, $colAllow, true)) {
            apiCoreLog('critical', 'scopedRow: disallowed id column', ['col' => $idColumn]);
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Request blocked']);
            exit;
        }
        return dbRow($sql, [$idValue, $uuid]);
    }
}

if (!function_exists('scopedList')) {
    /** List rows owned by $uuid only. */
    function scopedList(string $uuid, string $table, string $orderBy = 'created_at DESC', int $limit = 100): array
    {
        $limit = max(1, min(500, $limit));
        // Allowlist orderBy to avoid injection
        $orderAllow = ['created_at DESC','created_at ASC','updated_at DESC','id DESC','id ASC','title ASC'];
        if (!in_array($orderBy, $orderAllow, true)) {
            $orderBy = 'created_at DESC';
        }
        $sql = "SELECT * FROM `$table` WHERE `user_uuid` = ? ORDER BY $orderBy LIMIT " . (int)$limit;
        return dbQuery($sql, [$uuid]);
    }
}

if (!function_exists('scopedDelete')) {
    /** Delete a row ONLY if it belongs to $uuid. Returns true if deleted. */
    function scopedDelete(string $uuid, string $table, string $idColumn, mixed $idValue): bool
    {
        $colAllow = ['id','uuid','vehicle_id','listing_id','doc_id'];
        if (!in_array($idColumn, $colAllow, true)) {
            return false;
        }
        $sql = "DELETE FROM `$table` WHERE `$idColumn` = ? AND `user_uuid` = ?";
        return dbExecute($sql, [$idValue, $uuid]) > 0;
    }
}

if (!function_exists('requireRole')) {
    /** Require a specific role (e.g. 'admin') after requireUser(). */
    function requireRole(string $neededRole, string $actualRole): void
    {
        if ($actualRole !== $neededRole && $actualRole !== 'super_admin') {
            apiCoreLog('warning', 'Auth: insufficient role', ['needed' => $neededRole, 'had' => $actualRole]);
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Forbidden']);
            exit;
        }
    }
}
