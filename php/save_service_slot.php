<?php
session_start();

// ✅ CORS + Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Database connection
try {
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit();
}

// ✅ Read JSON input
$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;
$name = trim($input['name'] ?? '');
$date = trim($input['date'] ?? '');
$timeRaw = trim($input['time'] ?? '');
$availableSlot = (int)($input['availableSlot'] ?? 0);

// ✅ Convert time to 24-hour format
$time = date("H:i:s", strtotime($timeRaw));

// ✅ Input validation
if (!$name || !$date || !$time || $availableSlot < 1) {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit();
}

try {
    if ($id) {
        // ✅ Edit existing slot
        $check = $pdo->prepare("SELECT id FROM service_slots WHERE service_name = ? AND date = ? AND time = ? AND id != ?");
        $check->execute([$name, $date, $time, $id]);

        if ($check->rowCount() > 0) {
            echo json_encode(["success" => false, "error" => "Duplicate service slot exists"]);
            exit();
        }

        $update = $pdo->prepare("
            UPDATE service_slots 
            SET service_name = ?, date = ?, time = ?, available_slots = ? 
            WHERE id = ?
        ");
        $update->execute([$name, $date, $time, $availableSlot, $id]);

        echo json_encode(["success" => true, "message" => "Service slot updated", "mode" => "updated"]);
    } else {
        // ✅ Insert new slot
        $check = $pdo->prepare("SELECT id FROM service_slots WHERE service_name = ? AND date = ? AND time = ?");
        $check->execute([$name, $date, $time]);

        if ($check->rowCount() > 0) {
            echo json_encode(["success" => false, "error" => "Duplicate service slot"]);
            exit();
        }

        $insert = $pdo->prepare("
            INSERT INTO service_slots (service_name, date, time, available_slots) 
            VALUES (?, ?, ?, ?)
        ");
        $insert->execute([$name, $date, $time, $availableSlot]);

        echo json_encode([
            "success" => true,
            "message" => "Service slot added",
            "mode" => "inserted",
            "id" => $pdo->lastInsertId()
        ]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database query failed"]);
}
?>
