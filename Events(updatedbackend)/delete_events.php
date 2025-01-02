<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_app";

// Establish database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Fetch ID parameter
$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode([
        'status' => 'error',
        'message' => 'ID parameter is missing'
    ]);
    exit;
}

// Delete event by ID
$sql = "DELETE FROM events WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Event deleted successfully'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to delete event: ' . $stmt->error
    ]);
}

// Close resources
$stmt->close();
$conn->close();
?>
