<?php
/**
 * ============================================================================
 * api-core/deploy.php
 * ============================================================================
 * Blue-Green deployment crash strategy + health check + automated failback.
 *
 * [requirement #7] Blue-green strategy:
 *   Blue = current live version, Green = newly deployed/staged version.
 *   A HEALTH CHECK endpoint (/health) is probed after each deployment.
 *   If the green build fails health checks, an "automatic failback" latch is
 *   created so the router / reverse proxy / future requests route to the blue
 *   version instead. This file is deployment-agnostic and works with the
 *   provided shell script (deploy-blue-green.sh).
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/database.php';

// Release identifier written at build/deploy time (e.g. git short SHA)
define('RELEASE_ID', file_exists(__DIR__ . '/RELEASE') ? trim((string)file_get_contents(__DIR__ . '/RELEASE')) : 'dev');
define('DEPLOY_DIR', __DIR__ . '/deploy');

/* --------------------------------------------------------------------------
 * /health endpoint body — returns liveness + critical dependency checks.
 * ------------------------------------------------------------------------ */
if (!function_exists('healthPayload')) {
    function healthPayload(): array
    {
        $dbOk = false;
        $dbErr = null;
        try {
            getDb()->query('SELECT 1');
            $dbOk = true;
        } catch (Throwable $e) {
            $dbErr = $e->getMessage();
        }

        $payload = [
            'status'  => $dbOk ? 'ok' : 'degraded',
            'release' => RELEASE_ID,
            'time'    => gmdate(DATE_ATOM),
            'checks'  => [
                'db' => $dbOk ? 'ok' : 'error',
            ],
        ];
        if (APP_DEBUG && $dbErr) {
            $payload['checks']['db_error'] = $dbErr;
        }
        return $payload;

    }
}

// If this file is reached directly with ?health=1, respond as a health probe
if (basename($_SERVER['SCRIPT_NAME'] ?? '') === 'deploy.php' && ($_GET['health'] ?? 0) == 1) {
    $payload = healthPayload();
    http_response_code($payload['status'] === 'ok' ? 200 : 503);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($payload);
    exit;
}

/* --------------------------------------------------------------------------
 * Deployment state helpers — used by the deploy script and failback latch.
 * ------------------------------------------------------------------------ */
if (!function_exists('deployStatePath')) {
    function deployStatePath(): string
    {
        if (!is_dir(DEPLOY_DIR)) @mkdir(DEPLOY_DIR, 0755, true);
        return DEPLOY_DIR . '/state.json';
    }
}

if (!function_exists('deploySetState')) {
    function deploySetState(string $active, string $staged, string $status = 'ok'): void
    {
        $state = [
            'active'      => $active,
            'staged'      => $staged,
            'active_hash' => substr(hash('sha256', $active), 0, 12),
            'status'      => $status,
            'updated_at'  => gmdate(DATE_ATOM),
        ];
        file_put_contents(deployStatePath(), json_encode($state), LOCK_EX);
    }
}

if (!function_exists('deployGetState')) {
    function deployGetState(): array
    {
        $path = deployStatePath();
        if (!is_file($path)) return ['active' => 'blue', 'staged' => null, 'status' => 'unknown', 'updated_at' => null];
        $data = json_decode((string)file_get_contents($path), true);
        return is_array($data) ? $data : ['active' => 'blue', 'staged' => null, 'status' => 'unknown'];
    }
}

if (!function_exists('deployFailback')) {
    /**
     * If the staged ("green") build is unhealthy, flip back to "blue".
     * Call this from a monitoring cron or from the health check when the
     * green build is detected as broken while it is the active one.
     */
    function deployFailback(): void
    {
        $state = deployGetState();
        if (($state['active'] ?? 'blue') === 'green') {
            $state['active'] = 'blue';
            $state['status'] = 'failback';
            $state['failback_at'] = gmdate(DATE_ATOM);
            file_put_contents(deployStatePath(), json_encode($state), LOCK_EX);
            apiCoreLog('critical', 'AUTOMATIC BLUE-GREEN FAILBACK triggered', $state);
        }
    }
}
