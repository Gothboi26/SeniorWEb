<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

$pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ✅ Fetch appointments
function fetchAppointments($pdo, $user_id, $role) {
    $query = "SELECT appointments.id, appointments.service, appointments.date, appointments.time, appointments.status, appointments.remarks, users.username 
              FROM appointments
              JOIN users ON appointments.user_id = users.id";
    if ($role === 'client') {
        $query .= " WHERE appointments.user_id = :user_id";
    }

    $stmt = $pdo->prepare($query);
    if ($role === 'client') {
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    }

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ✅ Check slot availability
function hasAvailableSlot($pdo, $service, $date, $time) {
    $slotStmt = $pdo->prepare("SELECT max_slots FROM service_slots WHERE service_name = ? AND date = ? AND time = ?");
    $slotStmt->execute([$service, $date, $time]);
    $slot = $slotStmt->fetch(PDO::FETCH_ASSOC);

    if (!$slot || $slot['max_slots'] <= 0) {
        return false;
    }

    $usedStmt = $pdo->prepare("SELECT COUNT(*) as used FROM appointments WHERE service = ? AND date = ? AND time = ? AND status = 'Approved'");
    $usedStmt->execute([$service, $date, $time]);
    $used = $usedStmt->fetch(PDO::FETCH_ASSOC)['used'];

    return $used < $slot['max_slots'];
}

// ✅ Insert or update appointment
function handleAppointment($pdo, $data, $user_id, $role) {
    if (isset($data['appointment_id'])) {
        // Admin is updating status
        $appointment_id = $data['appointment_id'];
        $status = $data['status'];

        if ($status === 'Approved') {
            // Fetch the original appointment details
            $stmt = $pdo->prepare("SELECT service, date, time FROM appointments WHERE id = ?");
            $stmt->execute([$appointment_id]);
            $appt = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$appt) {
                return ['success' => false, 'error' => 'Appointment not found'];
            }

            // Check availability
            if (!hasAvailableSlot($pdo, $appt['service'], $appt['date'], $appt['time'])) {
                return ['success' => false, 'error' => 'Slot is already full, cannot approve'];
            }

            $update = $pdo->prepare("UPDATE appointments SET status = 'Approved', remarks = 'Please arrive 10 minutes early.' WHERE id = ?");
            $update->execute([$appointment_id]);
        } elseif ($status === 'Rejected') {
            $update = $pdo->prepare("UPDATE appointments SET status = 'Rejected', remarks = 'Your request was not approved.' WHERE id = ?");
            $update->execute([$appointment_id]);
        } else {
            $delete = $pdo->prepare("DELETE FROM appointments WHERE id = ?");
            $delete->execute([$appointment_id]);
        }

        return ['success' => true];
    } else {
        // Client is reserving
        $service = $data['service'];
        $date = $data['date'];
        $time = $data['time'];
        $status = $data['status'] ?? 'Pending';

        // Prevent reservation if no available slots
        if (!hasAvailableSlot($pdo, $service, $date, $time)) {
            return ['success' => false, 'error' => 'No remaining slots available for this time'];
        }

        $insert = $pdo->prepare("INSERT INTO appointments (service, date, time, status, user_id) 
                                 VALUES (?, ?, ?, ?, ?)");
        $insert->execute([$service, $date, $time, $status, $user_id]);

        return ['success' => true];
    }
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(fetchAppointments($pdo, $user_id, $role));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['service'], $data['date'], $data['time']) || isset($data['appointment_id'])) {
        echo json_encode(handleAppointment($pdo, $data, $user_id, $role));
    } else {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    }
}
?>
