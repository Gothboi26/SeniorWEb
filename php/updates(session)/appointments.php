<?php
session_start();

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Auth check
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

// DB connection
$pdo = new PDO("mysql:host=localhost;dbname=accnt", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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

function handleAppointment($pdo, $data) {
    if (isset($data['appointment_id'])) {
        $status = $data['status'];
        $stmt = $pdo->prepare($status === 'Approved'
            ? "UPDATE appointments SET status = :status WHERE id = :appointment_id"
            : "DELETE FROM appointments WHERE id = :appointment_id");
        if ($status === 'Approved') {
            $stmt->bindParam(':status', $status);
        }
        $stmt->bindParam(':appointment_id', $data['appointment_id'], PDO::PARAM_INT);
    } else {
        $stmt = $pdo->prepare("INSERT INTO appointments (service, date, time, status, user_id) 
                               VALUES (:service, :date, :time, :status, :user_id)");
        $stmt->bindParam(':service', $data['service']);
        $stmt->bindParam(':date', $data['date']);
        $stmt->bindParam(':time', $data['time']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);
    }
    $stmt->execute();
    return ['success' => true];
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(fetchAppointments($pdo, $user_id, $role));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['service'], $data['date'], $data['time'])) {
        $data['user_id'] = $user_id;
        $data['status'] = $data['status'] ?? 'Pending Approval';
        echo json_encode(handleAppointment($pdo, $data));
    } else {
        echo json_encode(['error' => 'Missing required fields']);
    }
}
?>
