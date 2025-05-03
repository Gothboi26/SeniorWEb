<?php
session_start();

// ✅ Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Login check
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// ✅ DB connection
try {
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

// ✅ GET: Fetch all appointments
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

// ✅ POST: Update status
if ($method === 'POST' && isset($input['appointment_id'], $input['status'])) {
    $appointmentId = $input['appointment_id'];

    // 🔒 Check current status BEFORE update
    $check = $pdo->prepare("SELECT status FROM appointments WHERE id = :id");
    $check->execute([':id' => $appointmentId]);
    $currentStatus = strtolower($check->fetchColumn());

    // ⛔ Already approved, skip everything
    if ($currentStatus === 'approved') {
        echo json_encode(['success' => true, 'message' => 'Already approved — no double adjustment.']);
        exit();
    }

    // ✅ Update status + remarks
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

    // ✅ Reduce available_slots if newly approved
    if (
        isset($input['adjust_slot'], $input['service'], $input['date'], $input['time']) &&
        $input['adjust_slot'] === true &&
        strtolower($input['status']) === 'approved'
    ) {
        $timeFormatted = date("H:i:s", strtotime($input['time']));
        $reduce = $pdo->prepare("
            UPDATE service_slots 
            SET available_slots = available_slots - 1 
            WHERE service_name = :service 
              AND date = :date 
              AND time = :time 
              AND available_slots > 0
        ");
        $reduce->execute([
            ':service' => $input['service'],
            ':date' => $input['date'],
            ':time' => $timeFormatted
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Status and remarks updated']);
    exit();
}

// ✅ PUT: Update appointment details
if ($method === 'PUT' && isset($input['appointment_id'], $input['service'], $input['date'], $input['time'])) {
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

// ✅ DELETE: Remove appointment
if ($method === 'DELETE' && isset($input['appointment_id'])) {
    $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = :id");
    $stmt->execute([':id' => $input['appointment_id']]);
    echo json_encode(['success' => true, 'message' => 'Appointment deleted']);
    exit();
}

// 🔴 Fallback
echo json_encode(['error' => 'Invalid request']);
