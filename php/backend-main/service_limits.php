<?php
session_start();
require_once "headers.php";
require_once "connection.php"; // this sets up $pdo

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
