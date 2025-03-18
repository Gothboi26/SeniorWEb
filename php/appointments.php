<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$host = 'localhost';
$dbname = 'accounts';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    file_put_contents('error_log.txt', "[" . date('Y-m-d H:i:s') . "] " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Function to fetch appointments for a specific user or all users (admin)
function fetchAppointments($pdo, $user_id = null, $role = 'client') {
    try {
        // Default query to get all appointments
        $query = "SELECT appointments.id, appointments.service, appointments.date, appointments.time, appointments.status, users.username, users.sex 
                  FROM appointments
                  JOIN users ON appointments.user_id = users.id";

        // If user is a client, filter appointments by their user_id
        if ($role === 'client' && $user_id) {
            $query .= " WHERE appointments.user_id = :user_id";
        }

        $stmt = $pdo->prepare($query);

        // Bind the user_id if the user is a client
        if ($role === 'client' && $user_id) {
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        file_put_contents('error_log.txt', "[" . date('Y-m-d H:i:s') . "] " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        return null;
    }
}

// Function to insert, update, or delete an appointment
function handleAppointment($pdo, $data) {
    try {
        if (isset($data['appointment_id'])) {
            // Update an existing appointment
            $appointment_id = $data['appointment_id'];
            $status = $data['status'];

            if ($status == 'Approved') {
                $stmt = $pdo->prepare("UPDATE appointments SET status = :status WHERE id = :appointment_id");
                $stmt->bindParam(':status', $status);
                $stmt->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);
            } elseif ($status == 'Rejected') {
                // Delete the appointment if rejected
                $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = :appointment_id");
                $stmt->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);
            }
        } else {
            // Insert a new appointment
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
    } catch (PDOException $e) {
        return ['error' => 'Error inserting/updating appointment: ' . $e->getMessage()];
    }
}

// Function to fetch user details by username (login)
function fetchUserDetails($pdo, $username) {
    try {
        $stmt = $pdo->prepare("SELECT id, username, password, role, age, sex, address, health_issue 
                               FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        file_put_contents('error_log.txt', "[" . date('Y-m-d H:i:s') . "] " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        return null;
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check for a user_id parameter to fetch appointments for a specific user
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $role = isset($_GET['role']) ? $_GET['role'] : 'client'; // Default role is 'client'

    // Fetch appointments for a specific user or all users if admin
    $appointments = fetchAppointments($pdo, $user_id, $role);

    if ($appointments !== null) {
        echo json_encode($appointments);
    } else {
        echo json_encode(['error' => 'Failed to fetch appointments.']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Handle login/authentication
    if (isset($data['username'], $data['password'])) {
        $user = fetchUserDetails($pdo, $data['username']);
        
        // If user is found and password is correct
        if ($user && password_verify($data['password'], $user['password'])) {
            // Assume 'role' is one of 'client', 'staff', or 'admin'
            $role = $user['role'];
            
            // Fetch appointments based on role
            if ($role === 'admin') {
                $appointments = fetchAppointments($pdo, null, 'admin'); // Admin can access all appointments
            } else {
                $appointments = fetchAppointments($pdo, $user['id'], 'client'); // Client can access only their own
            }

            echo json_encode(['success' => true, 'user' => $user, 'appointments' => $appointments]);
        } else {
            echo json_encode(['error' => 'Invalid username or password']);
        }
    }
    // Handle appointment creation, update, or deletion
    elseif (isset($data['service'], $data['date'], $data['time'], $data['user_id'])) {
        $status = isset($data['status']) ? $data['status'] : 'Pending Approval';  // Default status
        $data['status'] = $status;

        $result = handleAppointment($pdo, $data);
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'Missing required fields']);
    }
}
?>
