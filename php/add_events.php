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

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (is_null($data)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid JSON input'
    ]);
    exit;
}

// Extract and validate required fields
$id = $data['id'] ?? null;
$date_time = $data['date_time'] ?? null; // Combined date and time
$title = $data['event_title'] ?? null;
$description = $data['event_description'] ?? null;
$created_at = date('Y-m-d H:i:s'); // Auto-generate created_at timestamp

if (empty($date_time) || empty($title) || empty($description)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Date, title, or description is missing'
    ]);
    exit;
}

// If the ID exists, perform an update, else insert a new event
if ($id) {
    // Update existing event
    $sql = "UPDATE events SET date_time = ?, event_title = ?, event_description = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $date_time, $title, $description, $id);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Event updated successfully',
            'id' => $id // Return the ID of the updated record
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update event: ' . $stmt->error
        ]);
    }
} else {
    // Insert new event
    $sql = "INSERT INTO events (date_time, event_title, event_description, created_at) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $date_time, $title, $description, $created_at);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Event added successfully',
            'id' => $stmt->insert_id // Return the ID of the inserted record
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to execute SQL: ' . $stmt->error
        ]);
    }
}

// Close resources
$stmt->close();
$conn->close();
?>
