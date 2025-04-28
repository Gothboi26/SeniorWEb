<?php
session_start();

// ✅ Set CORS and Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Handle Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Connect to Database
try {
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {// ✅ Query future & today's slots only
$stmt = $pdo->prepare("
    SELECT id, service_name, date, time, available_slots 
    FROM service_slots 
    WHERE date >= :today 
    ORDER BY date ASC, time ASC
");
$stmt->execute(['today' => $today]);

    // If connection fails, return an empty array
    echo json_encode([]);
    exit();
}

// ✅ Fetch Service Slots
try {
    $stmt = $pdo->query("SELECT id, service_name, date, time, available_slots FROM service_slots ORDER BY date ASC, time ASC");
    $slots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ✅ Format the output properly
    $formattedSlots = array_map(function($slot) {
        return [
            "id" => (int)$slot['id'],
            "service_name" => $slot['service_name'],
            "date" => $slot['date'],
            "time" => $slot['time'],
            "available_slots" => (int)$slot['available_slots'],
        ];
    }, $slots);

    // ✅ Always return a pure array
    echo json_encode($formattedSlots);
} catch (PDOException $e) {
    // If fetching fails, return an empty array
    echo json_encode([]);
}
?>
