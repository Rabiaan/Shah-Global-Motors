<?php
/**
 * ============================================================================
 * api-core/example_endpoint.php
 * ============================================================================
 * A complete example endpoint demonstrating every api-core module working
 * together. Copy this as a template for your own protected resources.
 *
 * It shows:
 *   1. bootstrap (CORS own-domain, security headers, logging)
 *   2. rate limiting per endpoint
 *   3. JWT auth gating + STRICT per-user (UUID) scoping
 *   4. CSRF for browser state-changing requests
 *   5. Input sanitization (XSS) + prepared statements (SQL injection)
 *   6. Converts BINARY(16) UUID <-> canonical string
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/rate_limit.php';

$method = $_SERVER['REQUEST_METHOD'];

// ---- Rate limit everything on this endpoint --------------------------------
checkRateLimit('example-resource');

// ---------------------------------------------------------------------------
// UUID <-> BINARY(16) helpers (users.uuid and user_uuid cols store BINARY(16))
// ---------------------------------------------------------------------------
function uuidToBin(string $uuid): string
{
    return hex2bin(str_replace('-', '', $uuid));
}
function binToUuid(string $bin): string
{
    $hex = bin2hex($bin);
    return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-' . substr($hex, 12, 4) . '-' . substr($hex, 16, 4) . '-' . substr($hex, 20);
}

// ---------------------------------------------------------------------------
// Example resource: `user_notes` table (id VARCHAR(64), user_uuid BINARY(16))
// ---------------------------------------------------------------------------
switch ($method) {
    // Health probe used by the blue-green deploy script (no auth)
    case 'GET':
        if (($_GET['health'] ?? 0) === '1') {
            require_once __DIR__ . '/deploy.php';
            $payload = healthPayload();
            http_response_code($payload['status'] === 'ok' ? 200 : 503);
            echo json_encode($payload);
            exit;
        }

        // Listing: require auth, return ONLY the caller's rows
        $auth  = requireUser();
        $uuid  = $auth['uuid'];

        if (isset($_GET['one'])) {
            // Fetch a single row the caller owns (ensures 404 if not theirs)
            $row = scopedRow($uuid, 'user_notes', 'id', $_GET['one']);
            if (!$row) apiResponse(['status' => 'error', 'message' => 'Not found'], 404);
            apiResponse(['status' => 'success', 'data' => $row]);
        }

        $rows = scopedList($uuid, 'user_notes');
        apiResponse(['status' => 'success', 'data' => $rows]);

    case 'POST':
        // State-changing browser request -> require CSRF + auth
        csrfValidate();
        $auth  = requireUser();
        $uuid  = $auth['uuid'];
        $uuBin = uuidToBin($uuid);

        $in = jsonInput();
        $body = validateString(sanitizeInput($in['body'] ?? null), 1, 4000) ?: null;
        if ($body === null) apiResponse(['status' => 'error', 'message' => 'Invalid body'], 422);

        $id = 'note_' . bin2hex(random_bytes(12));
        dbExecute(
            'INSERT INTO user_notes (id, user_uuid, body, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())',
            [$id, $uuBin, $body]
        );
        apiCoreLog('info', 'Note created', ['user_uuid' => $uuid, 'id' => $id]);
        apiResponse(['status' => 'success', 'id' => $id], 201);

    case 'DELETE':
        csrfValidate();
        $auth  = requireUser();
        $uuid  = $auth['uuid'];
        $uuBin = uuidToBin($uuid);

        $id = $_GET['id'] ?? '';
        $deleted = scopedDelete($uuid, 'user_notes', 'id', $id);
        if (!$deleted) apiResponse(['status' => 'error', 'message' => 'Not found or not owned'], 404);
        apiCoreLog('info', 'Note deleted', ['user_uuid' => $uuid, 'id' => $id]);
        apiResponse(['status' => 'success']);

    default:
        apiResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
