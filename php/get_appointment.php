<?php
session_start();

// CORS and Content-Type Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check login
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Connect to database
try {
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

// GET: Fetch all appointments with full name
if ($method === 'GET') {
    $stmt = $pdo->query("
        SELECT appointments.*, 
               CONCAT(users.first_name, ' ', users.last_name) AS fullname 
        FROM appointments 
        JOIN users ON users.id = appointments.user_id 
        ORDER BY date DESC
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

// POST: Update status and optionally remarks
if ($method === 'POST' && isset($input['appointment_id'], $input['status'])) {
    $appointmentId = $input['appointment_id'];

    // Prevent duplicate slot adjustment
    $check = $pdo->prepare("SELECT status FROM appointments WHERE id = :id");
    $check->execute([':id' => $appointmentId]);
    $currentStatus = strtolower($check->fetchColumn());

    if ($currentStatus === 'approved') {
        echo json_encode(['success' => true, 'message' => 'Already approved — no duplicate adjustment.']);
        exit();
    }

    // Update status and remarks
    $stmt = $pdo->prepare("
        UPDATE appointments 
        SET status = :status, remarks = :remarks 
        WHERE id = :id
    ");
    $stmt->execute([
        ':status' => $input['status'],
        ':remarks' => $input['remarks'] ?? null,
        ':id' => $appointmentId
    ]);

    // Adjust slot if status approved
    if (
        isset($input['adjust_slot'], $input['service'], $input['date'], $input['time']) &&
        $input['adjust_slot'] === true &&
        strtolower($input['status']) === 'approved'
    ) {
        $time = date("H:i:s", strtotime($input['time']));

        $slotStmt = $pdo->prepare("
            UPDATE service_slots 
            SET max_slots = max_slots - 1 
            WHERE service_name = :service 
              AND date = :date 
              AND time = :time 
              AND max_slots > 0
        ");
        $slotStmt->execute([
            ':service' => $input['service'],
            ':date' => $input['date'],
            ':time' => $time
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Status and remarks updated']);
    exit();
}

// PUT: Update appointment details
if (
    $method === 'PUT' &&
    isset($input['appointment_id'], $input['service'], $input['date'], $input['time'])
) {
    $stmt = $pdo->prepare("
        UPDATE appointments 
        SET service = :service, date = :date, time = :time, remarks = :remarks 
        WHERE id = :id
    ");
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

// DELETE: Remove appointment
if ($method === 'DELETE' && isset($input['appointment_id'])) {
    $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = :id");
    $stmt->execute([':id' => $input['appointment_id']]);
    echo json_encode(['success' => true, 'message' => 'Appointment deleted']);
    exit();
}

// Fallback error
echo json_encode(['error' => 'Invalid request']);
