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
$dbname = "account";

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
$organizer = $data['organizer'] ?? null;
$date_time = $data['date_time'] ?? null;
$title = $data['event_title'] ?? null;
$description = $data['event_description'] ?? null;
$location = $data['location'] ?? null;
$created_at = date('Y-m-d H:i:s');

if (empty($organizer) || empty($date_time) || empty($title) || empty($description) || empty($location)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields: organizer, date, title, description, or location'
    ]);
    exit;
}

if ($id) {
    // Update existing event
    $sql = "UPDATE events SET organizer = ?, date_time = ?, event_title = ?, event_description = ?, location = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssi", $organizer, $date_time, $title, $description, $location, $id);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Event updated successfully',
            'id' => $id
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update event: ' . $stmt->error
        ]);
    }
} else {
    // Insert new event
    $sql = "INSERT INTO events (organizer, date_time, event_title, event_description, location, created_at) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $organizer, $date_time, $title, $description, $location, $created_at);
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Event added successfully',
            'id' => $stmt->insert_id
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to insert event: ' . $stmt->error
        ]);
    }
}

$stmt->close();
$conn->close();
?>
