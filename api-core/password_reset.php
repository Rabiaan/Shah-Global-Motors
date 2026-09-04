<?php
/**
 * ============================================================================
 * api-core/password_reset.php
 * ============================================================================
 * Password reset with links/tokens that EXPIRE after 30 minutes [requirement #2].
 *
 * Flow:
 *   1. User requests a reset -> generate a high-entropy, single-use token.
 *   2. Store its SHA-256 hash (never the raw token) + expiry in DB.
 *   3. Email a link containing the raw token (frontend opens a reset form).
 *   4. On submit: verify token hash exists, is unexpired, is unused, then
 *      update the password and invalidate the token immediately.
 *
 * The token is single-use (deleted/marked after use) and short-lived (30 min).
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/database.php';

if (!function_exists('generateResetToken')) {
    /** Create a reset token for a user UUID. Returns the RAW token (to email). */
    function generateResetToken(string $userUuid): string
    {
        $raw   = bin2hex(random_bytes(32));                       // 64-char raw token
        $hash  = hash('sha256', $raw);                            // store only the hash
        $expires = time() + PW_RESET_TTL;                        // 30 minutes from now

        // Invalidate any existing outstanding tokens for this user (single active)
        dbExecute('DELETE FROM password_reset_tokens WHERE user_uuid = ?', [$userUuid]);

        dbExecute(
            'INSERT INTO password_reset_tokens (user_uuid, token_hash, expires_at, used) VALUES (?, ?, ?, 0)',
            [$userUuid, $hash, gmdate('Y-m-d H:i:s', $expires)]
        );

        apiCoreLog('info', 'Password reset token issued', ['user_uuid' => $userUuid]);
        return $raw;
    }
}

if (!function_exists('resetTokenExpiresAt')) {
    /** Returns the unix expiry time (for countdown display), or null. */
    function resetTokenExpiresAt(string $rawToken): ?int
    {
        $hash = hash('sha256', $rawToken);
        $row = dbRow(
            'SELECT expires_at, used FROM password_reset_tokens WHERE token_hash = ? LIMIT 1',
            [$hash]
        );
        if (!$row || (int)$row['used'] === 1) return null;
        $exp = strtotime($row['expires_at']);
        return $exp !== false ? $exp : null;
    }
}

if (!function_exists('consumeResetToken')) {
    /**
     * Validates and consumes a reset token.
     * Returns ['ok' => true, 'user_uuid' => ...] on success, or
     * ['ok' => false, 'error' => 'invalid'|'expired'|'used'] on failure.
     */
    function consumeResetToken(string $rawToken): array
    {
        $hash = hash('sha256', $rawToken);
        $row = dbRow(
            'SELECT user_uuid, expires_at, used FROM password_reset_tokens WHERE token_hash = ? LIMIT 1',
            [$hash]
        );
        if (!$row) {
            return ['ok' => false, 'error' => 'invalid'];
        }
        if ((int)$row['used'] === 1) {
            apiCoreLog('warning', 'Reset token reuse attempt');
            return ['ok' => false, 'error' => 'used'];
        }
        $expires = strtotime($row['expires_at']);
        if ($expires === false || $expires < time()) {
            dbExecute('DELETE FROM password_reset_tokens WHERE token_hash = ?', [$hash]);
            return ['ok' => false, 'error' => 'expired'];
        }

        // Consume immediately (single-use)
        dbExecute('UPDATE password_reset_tokens SET used = 1 WHERE token_hash = ?', [$hash]);
        return ['ok' => true, 'user_uuid' => $row['user_uuid']];
    }
}

if (!function_exists('resetPassword')) {
    /** Verify token, hash new password, update the user's password_hash. */
    function resetPassword(string $rawToken, string $newPassword): array
    {
        if (strlen($newPassword) < 10) {
            return ['ok' => false, 'error' => 'weak_password'];
        }
        $result = consumeResetToken($rawToken);
        if (!$result['ok']) return $result;

        $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        dbExecute('UPDATE users SET password_hash = ? WHERE uuid = ?', [$newHash, $result['user_uuid']]);

        // Revoke any other sessions/tokens for this user after a reset
        dbExecute('DELETE FROM auth_sessions WHERE user_uuid = ?', [$result['user_uuid']]);

        apiCoreLog('warning', 'Password reset completed', ['user_uuid' => $result['user_uuid']]);
        return ['ok' => true];
    }
}
