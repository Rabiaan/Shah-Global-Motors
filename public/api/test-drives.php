<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM test_drives ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        $formatted = array_map(function($td) {
            return [
                'id' => $td['id'],
                'vehicleId' => $td['vehicle_id'],
                'vehicleName' => $td['vehicle_name'],
                'name' => $td['customer_name'],
                'email' => $td['customer_email'],
                'phone' => $td['customer_phone'],
                'preferredDate' => $td['preferred_date'],
                'preferredTime' => $td['preferred_time'],
                'notes' => $td['notes'],
                'status' => $td['status'],
                'createdAt' => $td['created_at'],
            ];
        }, $rows);
        sendResponse(['status' => 'success', 'data' => $formatted]);
        break;

    case 'POST':
        $input = getJsonInput();
        if (empty($input['name']) || empty($input['phone'])) {
            sendResponse(['status' => 'error', 'message' => 'Customer name and phone are required'], 400);
        }

        $id = $input['id'] ?? ('td_' . bin2hex(random_bytes(6)));
        $sql = "INSERT INTO test_drives (
            id, vehicle_id, vehicle_name, customer_name, customer_email, customer_phone,
            preferred_date, preferred_time, notes, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $id,
            $input['vehicleId'] ?? null,
            $input['vehicleName'] ?? 'General VIP Experience',
            $input['name'],
            $input['email'] ?? '',
            $input['phone'],
            $input['preferredDate'] ?? date('Y-m-d'),
            $input['preferredTime'] ?? '11:00 AM',
            $input['notes'] ?? '',
            $input['status'] ?? 'Pending',
        ]);

        sendResponse(['status' => 'success', 'message' => 'Test drive booked', 'id' => $id], 201);
        break;

    case 'PUT':
        $input = getJsonInput();
        $id = $_GET['id'] ?? ($input['id'] ?? null);
        if (!$id || empty($input['status'])) {
            sendResponse(['status' => 'error', 'message' => 'ID and status required'], 400);
        }
        $stmt = $pdo->prepare("UPDATE test_drives SET status = ? WHERE id = ?");
        $stmt->execute([$input['status'], $id]);
        sendResponse(['status' => 'success', 'message' => 'Test drive status updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (getJsonInput()['id'] ?? null);
        if (!$id) {
            sendResponse(['status' => 'error', 'message' => 'ID required'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM test_drives WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(['status' => 'success', 'message' => 'Test drive deleted']);
        break;

    default:
        sendResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
        break;
}
?>
