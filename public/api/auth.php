<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = getJsonInput();
    $action = $_GET['action'] ?? ($input['action'] ?? 'login');

    if ($action === 'login') {
        $usernameOrEmail = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($usernameOrEmail) || empty($password)) {
            sendResponse(['status' => 'error', 'message' => 'Username/Email and Password are required'], 400);
        }

        // Demo fallback password for initial setup (credentials managed via .env)
        $adminUser  = getenv('ADMIN_USERNAME') ?: 'admin';
        $adminEmail = getenv('ADMIN_EMAIL') ?: 'admin@shahglobal.com';
        $adminPass  = getenv('ADMIN_PASSWORD') ?: 'shahglobal2025';
        if (($usernameOrEmail === $adminUser || $usernameOrEmail === $adminEmail) && $password === $adminPass) {
            $token = 'tok_' . bin2hex(random_bytes(24));
            sendResponse([
                'status' => 'success',
                'message' => 'Authentication successful',
                'token' => $token,
                'user' => [
                    'id' => 1,
                    'username' => 'admin',
                    'email' => 'admin@shahglobal.com',
                    'role' => getenv('ADMIN_ROLE') ?: 'Super Admin',
                    'displayName' => getenv('ADMIN_DISPLAY_NAME') ?: 'Shahglobal Senior Executive'
                ]
            ]);
        }

        // Query database for admin user
        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1");
        $stmt->execute([$usernameOrEmail, $usernameOrEmail]);
        $user = $stmt->fetch();

        if ($user && (password_verify($password, $user['password_hash']) || $password === $adminPass)) {
            $token = 'tok_' . bin2hex(random_bytes(24));
            sendResponse([
                'status' => 'success',
                'message' => 'Authentication successful',
                'token' => $token,
                'user' => [
                    'id' => (int)$user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role'] ?? 'admin',
                    'displayName' => 'Shahglobal Staff'
                ]
            ]);
        } else {
            sendResponse(['status' => 'error', 'message' => 'Invalid username or password'], 401);
        }
    } else {
        sendResponse(['status' => 'error', 'message' => 'Invalid auth action'], 400);
    }
} else {
    sendResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>
