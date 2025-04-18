<?php
session_start();

// File: service_limits.php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Step 1: Get unique service names from appointments table
    $stmt = $pdo->query("SELECT DISTINCT service FROM appointments");
    $servicesInAppointments = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Step 2: Get existing limits
    $stmt2 = $pdo->query("SELECT service_name, max_slots FROM service_limits");
    $existingLimits = $stmt2->fetchAll(PDO::FETCH_KEY_PAIR); // [service_name => max_slots]

    $finalList = [];

    foreach ($servicesInAppointments as $service) {
        $finalList[] = [
            'service_name' => $service,
            'max_slots' => $existingLimits[$service] ?? 5, // fallback default
        ];
    }

    echo json_encode($finalList);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO service_limits (service_name, max_slots) VALUES (:name, :slots)
                           ON DUPLICATE KEY UPDATE max_slots = :slots");
    $stmt->execute([
        ':name' => $data['service_name'],
        ':slots' => (int)$data['max_slots'],
    ]);
    echo json_encode(['success' => true]);
}
?>
