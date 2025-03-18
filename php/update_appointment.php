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

// Handle appointment approval or rejection
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (isset($data['appointment_id']) && isset($data['status'])) {
        $appointment_id = $data['appointment_id'];
        $status = $data['status']; // Should be "approved" or "rejected"

        // Validate status
        if ($status !== 'approved' && $status !== 'rejected') {
            echo json_encode(['error' => 'Invalid status. Please use "approved" or "rejected".']);
            exit;
        }

        try {
            // Update appointment status if approved
            if ($status === 'approved') {
                $stmt = $pdo->prepare("UPDATE appointments SET status = :status WHERE id = :appointment_id");
                $stmt->bindParam(':status', $status);
                $stmt->bindParam(':appointment_id', $appointment_id);
                $stmt->execute();

                echo json_encode(['success' => true, 'message' => 'Appointment approved successfully.']);
            } 
            // Delete appointment if rejected
            elseif ($status === 'rejected') {
                $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = :appointment_id");
                $stmt->bindParam(':appointment_id', $appointment_id);
                $stmt->execute();

                echo json_encode(['success' => true, 'message' => 'Appointment rejected successfully.']);
            }
        } catch (PDOException $e) {
            file_put_contents('error_log.txt', "[" . date('Y-m-d H:i:s') . "] " . $e->getMessage() . PHP_EOL, FILE_APPEND);
            echo json_encode(['error' => 'Error updating appointment: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Missing required fields (appointment_id, status)']);
    }
}
?>
