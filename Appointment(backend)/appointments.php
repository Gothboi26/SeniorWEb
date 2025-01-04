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

// Fetch all appointments with username (filtered by user_id)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Check if the user is authenticated (for example, you could get user_id from the session or a GET parameter)
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

        if ($user_id) {
            // Fetch appointments for a specific client (based on user_id)
            $stmt = $pdo->prepare("SELECT 
                                        appointments.id, 
                                        appointments.service, 
                                        appointments.date, 
                                        appointments.time, 
                                        appointments.status, 
                                        users.username 
                                   FROM 
                                        appointments 
                                   JOIN 
                                        users 
                                   ON 
                                        appointments.user_id = users.id
                                   WHERE appointments.user_id = :user_id");
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            // If not a specific user, admin can view all appointments
            $stmt = $pdo->prepare("SELECT 
                                        appointments.id, 
                                        appointments.service, 
                                        appointments.date, 
                                        appointments.time, 
                                        appointments.status, 
                                        users.username 
                                   FROM 
                                        appointments 
                                   JOIN 
                                        users 
                                   ON 
                                        appointments.user_id = users.id");
            $stmt->execute();
            $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($appointments);
    } catch (PDOException $e) {
        file_put_contents('error_log.txt', "[" . date('Y-m-d H:i:s') . "] " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        echo json_encode(['error' => 'Failed to fetch appointments.']);
    }
}

// Handle new appointment reservation or status update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['service'], $data['date'], $data['time'], $data['user_id'])) {
        $service = $data['service'];
        $date = $data['date'];
        $time = $data['time'];
        $status = isset($data['status']) ? $data['status'] : 'Pending Approval';  // Default status
        $user_id = $data['user_id'];

        if (isset($data['appointment_id'])) {
            // Update the appointment status (approve/reject)
            $appointment_id = $data['appointment_id'];
            $status = $data['status'];

            // Check if the status is "Approved", then update the appointment
            if ($status == 'Approved') {
                // Automatically update the appointment status to "Approved"
                $stmt = $pdo->prepare("UPDATE appointments SET status = :status WHERE id = :appointment_id");
                $stmt->bindParam(':status', $status);
                $stmt->bindParam(':appointment_id', $appointment_id);
            } elseif ($status == 'Rejected') {
                // Delete the appointment if rejected
                $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = :appointment_id");
                $stmt->bindParam(':appointment_id', $appointment_id);
            }
        } else {
            // Insert new appointment for a client
            $stmt = $pdo->prepare("INSERT INTO appointments (service, date, time, status, user_id) VALUES (:service, :date, :time, :status, :user_id)");
            $stmt->bindParam(':service', $service);
            $stmt->bindParam(':date', $date);
            $stmt->bindParam(':time', $time);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':user_id', $user_id);
        }

        try {
            $stmt->execute();
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error inserting/updating appointment: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Missing required fields']);
    }
}
?>
