<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$dbname = "calendar_app"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// Read and decode the incoming data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the event ID is provided
$eventId = isset($data['id']) ? $data['id'] : null;

if (empty($eventId)) {
    echo json_encode(['status' => 'error', 'message' => 'Event ID is missing']);
    exit;
}

// Prepare the DELETE SQL statement
$sql = "DELETE FROM events WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $eventId); // "i" is for integer type (event ID)

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Event deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
