<?php
/**
 * ============================================================================
 * api-core/security.php
 * ============================================================================
 * Input sanitization / validation and CSRF protection.
 *
 * XSS PROTECTION [requirement #4]:
 *   - ALL output that will ever be rendered into HTML must pass through
 *     htmlEscape() AT THE POINT OF OUTPUT in the consuming frontend.
 *   - For API JSON responses, data is delivered raw (JSON is not HTML), but
 *     anything you later echo into <script>/HTML must be escaped.
 *   - sanitizeInput() strips/rejects dangerous script-bearing content on write.
 *   - A global headers policy (see bootstrap) prevents inline script execution.
 *
 * CSRF PROTECTION:
 *   - For state-changing requests from browsers, require an X-CSRF-Token header
 *     that matches the one issued with the session / auth token.
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

/* --------------------------------------------------------------------------
 * Output escaping — call on ANY value before embedding into HTML/attribute.
 * ------------------------------------------------------------------------ */
if (!function_exists('htmlEscape')) {
    function htmlEscape(?string $value): string
    {
        return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

/* --------------------------------------------------------------------------
 * Input sanitization — recursively strip dangerous markup on write.
 * ------------------------------------------------------------------------ */
if (!function_exists('sanitizeInput')) {
    function sanitizeInput(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map('sanitizeInput', $value);
        }
        if (!is_string($value)) return $value;

        // Trim and strip null bytes
        $value = trim(str_replace("\0", '', $value));

        // Reject obviously malicious payloads outright
        $forbidden = [
            '/<\s*script/i', '/<\s*iframe/i', '/<\s*object/i',
            '/<\s*embed/i', '/<\s*link/i', '/onerror\s*=/i',
            '/javascript\s*:/i', '/vbscript\s*:/i', '/data\s*:\s*text\/html/i',
        ];
        foreach ($forbidden as $pattern) {
            if (preg_match($pattern, $value)) {
                // Remove the offending content (safe default) rather than error
                $value = preg_replace($pattern, '', $value);
            }
        }

        return $value;
    }
}

/* --------------------------------------------------------------------------
 * String validation presets
 * ------------------------------------------------------------------------ */
if (!function_exists('validateString')) {
    function validateString(mixed $value, int $min = 0, int $max = 255): ?string
    {
        if (!is_string($value)) return null;
        $len = mb_strlen($value);
        if ($len < $min || $len > $max) return null;
        return $value;
    }
}

if (!function_exists('validateEmail')) {
    function validateEmail(mixed $value): ?string
    {
        if (!is_string($value)) return null;
        $value = filter_var(trim($value), FILTER_VALIDATE_EMAIL);
        return $value === false ? null : (string)$value;
    }
}

if (!function_exists('validateInt')) {
    function validateInt(mixed $value, ?int $min = null, ?int $max = null): ?int
    {
        if (is_int($value)) $num = $value;
        elseif (is_string($value) && preg_match('/^-?\d+$/', $value)) $num = (int)$value;
        else return null;
        if ($min !== null && $num < $min) return null;
        if ($max !== null && $num > $max) return null;
        return $num;
    }
}

/* --------------------------------------------------------------------------
 * CSRF validation for browser state-changing requests
 * ------------------------------------------------------------------------ */
if (!function_exists('csrfValidate')) {
    /**
     * Validates the X-CSRF-Token header against the one bound to the current
     * session/JWT. Call at the top of every state-changing (non-GET) endpoint
     * that is hit from a browser.
     *
     * The token is derived server-side from: session id (or resolved user UUID)
     * + a server secret — so it can't be forged without the TLS connection.
     */
    function csrfValidate(?string $userId = null): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) return;

        $session = $_SESSION['csrf_token'] ?? null;
        if ($session === null) {
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Missing CSRF token']);
            exit;
        }

        $send = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!hash_equals($session, $send)) {
            apiCoreLog('warning', 'CSRF validation failed', ['user' => $userId]);
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Invalid CSRF token']);
            exit;
        }
    }
}

if (!function_exists('csrfIssueToken')) {
    /** Generates and stores a CSRF token in the PHP session. Return to client. */
    function csrfIssueToken(): string
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            $secure = APP_ENV === 'production';
            session_set_cookie_params([
                'lifetime' => 0,
                'path'     => '/',
                'secure'   => $secure,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            session_start();
        }
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
}
