<?php
session_start();
require_once "headers.php";
require_once "connection.php";


}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

// GET: Fetch all appointments with username
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT appointments.*, users.username 
                         FROM appointments 
                         JOIN users ON users.id = appointments.user_id 
                         ORDER BY date DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

// POST: Update status and optionally remarks
if ($method === 'POST' && isset($input['appointment_id'], $input['status'])) {
    $stmt = $pdo->prepare("UPDATE appointments 
                           SET status = :status, remarks = :remarks 
                           WHERE id = :id");
    $stmt->execute([
        ':status' => $input['status'],
        ':remarks' => $input['remarks'] ?? null,
        ':id' => $input['appointment_id']
    ]);

    // Adjust slot if approved and requested
    if (
        isset($input['adjust_slot'], $input['service'], $input['date'], $input['time']) &&
        $input['adjust_slot'] === true &&
        strtolower($input['status']) === 'approved'
    ) {
        // Ensure time format is compatible with the database format (HH:MM:SS)
        $time = date("H:i:s", strtotime($input['time']));

        $slotStmt = $pdo->prepare("UPDATE service_slots 
                                   SET max_slots = max_slots - 1 
                                   WHERE service_name = :service 
                                     AND date = :date 
                                     AND time = :time 
                                     AND max_slots > 0");
        $slotStmt->execute([
            ':service' => $input['service'],
            ':date' => $input['date'],
            ':time' => $time
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Status and remarks updated']);
    exit();
}

// PUT: Update service, date, time, and optionally remarks
if (
    $method === 'PUT' &&
    isset($input['appointment_id'], $input['service'], $input['date'], $input['time'])
) {
    $stmt = $pdo->prepare("UPDATE appointments 
                           SET service = :service, date = :date, time = :time, remarks = :remarks 
                           WHERE id = :id");
    $stmt->execute([
        ':service' => $input['service'],
        ':date' => $input['date'],
        ':time' => $input['time'],
        ':remarks' => $input['remarks'] ?? null,
        ':id' => $input['appointment_id']
    ]);
    echo json_encode(['success' => true, 'message' => 'Appointment updated']);
    exit();
}

// DELETE: Remove an appointment
if ($method === 'DELETE' && isset($input['appointment_id'])) {
    $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = :id");
    $stmt->execute([':id' => $input['appointment_id']]);
    echo json_encode(['success' => true, 'message' => 'Appointment deleted']);
    exit();
}

echo json_encode(['error' => 'Invalid request']);
?>
