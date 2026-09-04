<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve single or all vehicles
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE id = ? LIMIT 1");
            $stmt->execute([$_GET['id']]);
            $vehicle = $stmt->fetch();
            if ($vehicle) {
                $vehicle['features'] = json_decode($vehicle['features'] ?: '[]', true);
                $vehicle['images'] = json_decode($vehicle['images'] ?: '[]', true);
                $vehicle['specs'] = [
                    'horsepower' => (int)$vehicle['horsepower'],
                    'topSpeed' => $vehicle['top_speed'],
                    'acceleration' => $vehicle['acceleration'],
                    'vin' => $vehicle['vin'],
                ];
                sendResponse(['status' => 'success', 'data' => $vehicle]);
            } else {
                sendResponse(['status' => 'error', 'message' => 'Vehicle not found'], 404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM vehicles ORDER BY date_added DESC");
            $rows = $stmt->fetchAll();
            $vehicles = array_map(function($v) {
                $v['features'] = json_decode($v['features'] ?: '[]', true);
                $v['images'] = json_decode($v['images'] ?: '[]', true);
                $v['specs'] = [
                    'horsepower' => (int)$v['horsepower'],
                    'topSpeed' => $v['top_speed'],
                    'acceleration' => $v['acceleration'],
                    'vin' => $v['vin'],
                ];
                return $v;
            }, $rows);
            sendResponse(['status' => 'success', 'count' => count($vehicles), 'data' => $vehicles]);
        }
        break;

    case 'POST':
        // Add new vehicle
        $input = getJsonInput();
        if (empty($input['make']) || empty($input['model'])) {
            sendResponse(['status' => 'error', 'message' => 'Make and model are required'], 400);
        }

        $id = $input['id'] ?? ('veh_' . bin2hex(random_bytes(6)));
        $featuresJson = json_encode($input['features'] ?? []);
        $imagesJson = json_encode($input['images'] ?? []);
        $specs = $input['specs'] ?? [];

        $sql = "INSERT INTO vehicles (
            id, make, model, year, price, mileage, engine, transmission, fuel_type,
            body_type, color, category, availability, `condition`, location,
            description, features, images, horsepower, top_speed, acceleration, vin, date_added
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $id,
            $input['make'],
            $input['model'],
            (int)($input['year'] ?? 2025),
            (float)($input['price'] ?? 0),
            (int)($input['mileage'] ?? 0),
            $input['engine'] ?? 'V8 High Performance',
            $input['transmission'] ?? 'Automatic',
            $input['fuelType'] ?? 'Petrol',
            $input['bodyType'] ?? 'Coupe',
            $input['color'] ?? 'Black',
            $input['category'] ?? 'New',
            $input['availability'] ?? 'Available',
            $input['condition'] ?? 'Brand New',
            $input['location'] ?? 'Silicon Valley Showroom',
            $input['description'] ?? '',
            $featuresJson,
            $imagesJson,
            (int)($specs['horsepower'] ?? 500),
            $specs['topSpeed'] ?? '200 mph',
            $specs['acceleration'] ?? '3.2s',
            $specs['vin'] ?? ('VIN' . strtoupper(bin2hex(random_bytes(4)))),
        ]);

        sendResponse(['status' => 'success', 'message' => 'Vehicle added successfully', 'id' => $id], 201);
        break;

    case 'PUT':
        // Update vehicle
        $input = getJsonInput();
        $id = $_GET['id'] ?? ($input['id'] ?? null);
        if (!$id) {
            sendResponse(['status' => 'error', 'message' => 'Vehicle ID is required for update'], 400);
        }

        $fields = [];
        $params = [];

        if (isset($input['make'])) { $fields[] = "make = ?"; $params[] = $input['make']; }
        if (isset($input['model'])) { $fields[] = "model = ?"; $params[] = $input['model']; }
        if (isset($input['year'])) { $fields[] = "year = ?"; $params[] = (int)$input['year']; }
        if (isset($input['price'])) { $fields[] = "price = ?"; $params[] = (float)$input['price']; }
        if (isset($input['mileage'])) { $fields[] = "mileage = ?"; $params[] = (int)$input['mileage']; }
        if (isset($input['engine'])) { $fields[] = "engine = ?"; $params[] = $input['engine']; }
        if (isset($input['transmission'])) { $fields[] = "transmission = ?"; $params[] = $input['transmission']; }
        if (isset($input['fuelType'])) { $fields[] = "fuel_type = ?"; $params[] = $input['fuelType']; }
        if (isset($input['bodyType'])) { $fields[] = "body_type = ?"; $params[] = $input['bodyType']; }
        if (isset($input['color'])) { $fields[] = "color = ?"; $params[] = $input['color']; }
        if (isset($input['category'])) { $fields[] = "category = ?"; $params[] = $input['category']; }
        if (isset($input['availability'])) { $fields[] = "availability = ?"; $params[] = $input['availability']; }
        if (isset($input['condition'])) { $fields[] = "`condition` = ?"; $params[] = $input['condition']; }
        if (isset($input['location'])) { $fields[] = "location = ?"; $params[] = $input['location']; }
        if (isset($input['description'])) { $fields[] = "description = ?"; $params[] = $input['description']; }
        if (isset($input['features'])) { $fields[] = "features = ?"; $params[] = json_encode($input['features']); }
        if (isset($input['images'])) { $fields[] = "images = ?"; $params[] = json_encode($input['images']); }
        if (isset($input['specs'])) {
            if (isset($input['specs']['horsepower'])) { $fields[] = "horsepower = ?"; $params[] = (int)$input['specs']['horsepower']; }
            if (isset($input['specs']['topSpeed'])) { $fields[] = "top_speed = ?"; $params[] = $input['specs']['topSpeed']; }
            if (isset($input['specs']['acceleration'])) { $fields[] = "acceleration = ?"; $params[] = $input['specs']['acceleration']; }
            if (isset($input['specs']['vin'])) { $fields[] = "vin = ?"; $params[] = $input['specs']['vin']; }
        }

        if (empty($fields)) {
            sendResponse(['status' => 'error', 'message' => 'No fields provided for update'], 400);
        }

        $params[] = $id;
        $sql = "UPDATE vehicles SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendResponse(['status' => 'success', 'message' => 'Vehicle updated successfully']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (getJsonInput()['id'] ?? null);
        if (!$id) {
            sendResponse(['status' => 'error', 'message' => 'Vehicle ID is required for deletion'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM vehicles WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(['status' => 'success', 'message' => 'Vehicle deleted successfully']);
        break;

    default:
        sendResponse(['status' => 'error', 'message' => 'Method not supported'], 405);
        break;
}
?>
