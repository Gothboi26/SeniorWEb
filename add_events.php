<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "aliah1234";
$dbname = "calendar_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// Read and decode JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Debugging: Log incoming data
error_log("Raw data received: " . file_get_contents("php://input"));
error_log("Decoded data: " . print_r($data, true));

// Check if data is correctly received
$date = isset($data['date']) ? $data['date'] : null;
$title = isset($data['title']) ? $data['title'] : null;
$description = isset($data['description']) ? $data['description'] : null;

if (empty($date) || empty($title) || empty($description)) {
    echo json_encode(['status' => 'error', 'message' => 'Date, title, or description is empty']);
    exit;
}

// Prepare and execute the SQL statement
$sql = "INSERT INTO events (date, event_title, event_description) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $date, $title, $description);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
