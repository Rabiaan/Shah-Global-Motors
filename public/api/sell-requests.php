<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM sell_requests ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        $formatted = array_map(function($sr) {
            return [
                'id' => $sr['id'],
                'name' => $sr['name'],
                'email' => $sr['email'],
                'phone' => $sr['phone'],
                'make' => $sr['make'],
                'model' => $sr['model'],
                'year' => (int)$sr['year'],
                'mileage' => (int)$sr['mileage'],
                'condition' => $sr['condition'],
                'expectedPrice' => (float)$sr['expected_price'],
                'offerAmount' => $sr['offer_amount'] ? (float)$sr['offer_amount'] : null,
                'notes' => $sr['notes'],
                'images' => json_decode($sr['images'] ?: '[]', true),
                'status' => $sr['status'],
                'createdAt' => $sr['created_at'],
            ];
        }, $rows);
        sendResponse(['status' => 'success', 'data' => $formatted]);
        break;

    case 'POST':
        $input = getJsonInput();
        if (empty($input['name']) || empty($input['phone']) || empty($input['make']) || empty($input['model'])) {
            sendResponse(['status' => 'error', 'message' => 'Owner info and vehicle make/model are required'], 400);
        }

        $id = $input['id'] ?? ('sr_' . bin2hex(random_bytes(6)));
        $imagesJson = json_encode($input['images'] ?? []);

        $sql = "INSERT INTO sell_requests (
            id, name, email, phone, make, model, year, mileage, `condition`,
            expected_price, offer_amount, notes, images, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $id,
            $input['name'],
            $input['email'] ?? '',
            $input['phone'],
            $input['make'],
            $input['model'],
            (int)($input['year'] ?? 2024),
            (int)($input['mileage'] ?? 1000),
            $input['condition'] ?? 'Excellent',
            (float)($input['expectedPrice'] ?? 0),
            isset($input['offerAmount']) ? (float)$input['offerAmount'] : null,
            $input['notes'] ?? '',
            $imagesJson,
            $input['status'] ?? 'Pending',
        ]);

        sendResponse(['status' => 'success', 'message' => 'Sell request submitted', 'id' => $id], 201);
        break;

    case 'PUT':
        $input = getJsonInput();
        $id = $_GET['id'] ?? ($input['id'] ?? null);
        if (!$id) {
            sendResponse(['status' => 'error', 'message' => 'ID required'], 400);
        }

        $fields = [];
        $params = [];

        if (isset($input['status'])) {
            $fields[] = "status = ?";
            $params[] = $input['status'];
        }
        if (isset($input['offerAmount'])) {
            $fields[] = "offer_amount = ?";
            $params[] = (float)$input['offerAmount'];
        }

        if (empty($fields)) {
            sendResponse(['status' => 'error', 'message' => 'No fields to update'], 400);
        }

        $params[] = $id;
        $stmt = $pdo->prepare("UPDATE sell_requests SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        sendResponse(['status' => 'success', 'message' => 'Sell request updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (getJsonInput()['id'] ?? null);
        if (!$id) {
            sendResponse(['status' => 'error', 'message' => 'ID required'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM sell_requests WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(['status' => 'success', 'message' => 'Sell request deleted']);
        break;

    default:
        sendResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
        break;
}
?>
