<?php
session_start();

// ✅ CORS + Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Preflight response
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Check user authentication
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized access']);
    exit();
}

// ✅ Database connection
try {
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// ✅ Constants
define('STATUS_PENDING', 'Pending');
define('STATUS_APPROVED', 'Approved');
define('STATUS_REJECTED', 'Rejected');

// ✅ Session info
$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'] ?? 'client';

// ✅ Utility Functions
function fetchAppointments($pdo, $user_id, $role) {
    if ($role === 'client') {
        $stmt = $pdo->prepare("SELECT * FROM appointments WHERE user_id = ?");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $stmt = $pdo->query("SELECT appointments.*, users.username 
                             FROM appointments 
                             JOIN users ON appointments.user_id = users.id");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

function hasAvailableSlot($pdo, $service, $date, $time) {
    // ✅ Now fetching available_slots not max_slots
    $slotStmt = $pdo->prepare("SELECT available_slots FROM service_slots WHERE service_name = ? AND date = ? AND time = ?");
    $slotStmt->execute([$service, $date, $time]);
    $slot = $slotStmt->fetch(PDO::FETCH_ASSOC);

    if (!$slot || $slot['available_slots'] <= 0) {
        return false;
    }

    return true;
}

function validateDateAndTime($date, $time) {
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) && preg_match('/^\d{2}:\d{2}:\d{2}$/', $time);
}

function handleAppointment($pdo, $data, $user_id, $role) {
    if (isset($data['appointment_id'])) {
        // Admin is updating status
        $appointment_id = $data['appointment_id'];
        $new_status = ucfirst(strtolower($data['status'] ?? ''));

        // Validate new status
        if (!in_array($new_status, [STATUS_APPROVED, STATUS_REJECTED])) {
            return ['success' => false, 'error' => 'Invalid status update'];
        }

        // Fetch appointment
        $stmt = $pdo->prepare("SELECT service, date, time FROM appointments WHERE id = ?");
        $stmt->execute([$appointment_id]);
        $appt = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$appt) {
            return ['success' => false, 'error' => 'Appointment not found'];
        }

        if ($new_status === STATUS_APPROVED) {
            if (!hasAvailableSlot($pdo, $appt['service'], $appt['date'], $appt['time'])) {
                return ['success' => false, 'error' => 'Slot already full, cannot approve'];
            }

            $remarks = "Pakitiyak na dumating 10 minuto bago ang appointment.";
            $update = $pdo->prepare("UPDATE appointments SET status = ?, remarks = ? WHERE id = ?");
            $update->execute([STATUS_APPROVED, $remarks, $appointment_id]);
        } elseif ($new_status === STATUS_REJECTED) {
            $remarks = "Paumanhin, hindi naaprubahan ang inyong kahilingan.";
            $update = $pdo->prepare("UPDATE appointments SET status = ?, remarks = ? WHERE id = ?");
            $update->execute([STATUS_REJECTED, $remarks, $appointment_id]);
        }

        return ['success' => true];

    } else {
        // Client creating appointment
        $service = trim($data['service'] ?? '');
        $date = trim($data['date'] ?? '');
        $time = trim($data['time'] ?? '');
        $status = STATUS_PENDING;

        if (!$service || !$date || !$time) {
            return ['success' => false, 'error' => 'Missing required fields'];
        }

        if (!validateDateAndTime($date, $time)) {
            return ['success' => false, 'error' => 'Invalid date or time format'];
        }

        // Prevent duplicate reservation for same slot
        $checkDup = $pdo->prepare("SELECT COUNT(*) FROM appointments 
                                   WHERE user_id = ? AND service = ? AND date = ? AND time = ? 
                                   AND status != ?");
        $checkDup->execute([$user_id, $service, $date, $time, STATUS_REJECTED]);
        if ($checkDup->fetchColumn() > 0) {
            return ['success' => false, 'error' => 'You already have a reservation for this slot'];
        }

        // Check availability
        if (!hasAvailableSlot($pdo, $service, $date, $time)) {
            return ['success' => false, 'error' => 'No remaining slots available for this time'];
        }

        // Insert appointment
        $insert = $pdo->prepare("INSERT INTO appointments (service, date, time, status, user_id) 
                                 VALUES (?, ?, ?, ?, ?)");
        $insert->execute([$service, $date, $time, $status, $user_id]);
        $appointment_id = $pdo->lastInsertId();

        return ['success' => true, 'appointment_id' => $appointment_id];
    }
}

// ✅ Handle Request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(fetchAppointments($pdo, $user_id, $role));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (is_array($data)) {
        echo json_encode(handleAppointment($pdo, $data, $user_id, $role));
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid request body']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Unsupported request method']);
}
?>
