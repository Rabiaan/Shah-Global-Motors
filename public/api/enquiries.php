<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM enquiries ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        $formatted = array_map(function($e) {
            return [
                'id' => $e['id'],
                'vehicleId' => $e['vehicle_id'],
                'vehicleName' => $e['vehicle_name'],
                'name' => $e['name'],
                'email' => $e['email'],
                'phone' => $e['phone'],
                'message' => $e['message'],
                'status' => $e['status'],
                'createdAt' => $e['created_at'],
            ];
        }, $rows);
        sendResponse(['status' => 'success', 'data' => $formatted]);
        break;

    case 'POST':
        $input = getJsonInput();
        if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
            sendResponse(['status' => 'error', 'message' => 'Name, email, and message are required'], 400);
        }

        $id = $input['id'] ?? ('enq_' . bin2hex(random_bytes(6)));
        $sql = "INSERT INTO enquiries (
            id, vehicle_id, vehicle_name, name, email, phone, message, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $id,
            $input['vehicleId'] ?? null,
            $input['vehicleName'] ?? null,
            $input['name'],
            $input['email'],
            $input['phone'] ?? null,
            $input['message'],
            $input['status'] ?? 'New',
        ]);

        sendResponse(['status' => 'success', 'message' => 'Enquiry submitted', 'id' => $id], 201);
        break;

    case 'PUT':
        $input = getJsonInput();
        $id = $_GET['id'] ?? ($input['id'] ?? null);
        if (!$id || empty($input['status'])) {
            sendResponse(['status' => 'error', 'message' => 'ID and status required'], 400);
        }
        $stmt = $pdo->prepare("UPDATE enquiries SET status = ? WHERE id = ?");
        $stmt->execute([$input['status'], $id]);
        sendResponse(['status' => 'success', 'message' => 'Enquiry status updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (getJsonInput()['id'] ?? null);
        if (!$id) {
            sendResponse(['status' => 'error', 'message' => 'ID required'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM enquiries WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(['status' => 'success', 'message' => 'Enquiry deleted']);
        break;

    default:
        sendResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
        break;
}
?>
