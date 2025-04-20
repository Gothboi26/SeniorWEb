<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $response = [
        "appointments" => [],
        "emergencies" => []
    ];

    // ✅ Fetch latest 5 pending appointments
    $stmt1 = $pdo->query("SELECT id, date, service, status FROM appointments WHERE status = 'pending' ORDER BY date DESC LIMIT 5");
    $response["appointments"] = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // ✅ Fetch latest 5 pending emergencies
    $stmt2 = $pdo->query("SELECT id, date_reported AS date, type AS emergency_type, status FROM emergencies WHERE status = 'pending' ORDER BY date_reported DESC LIMIT 5");
    $response["emergencies"] = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    exit();
}
