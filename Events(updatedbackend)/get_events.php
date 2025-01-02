<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
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

// Fetch parameters
$date = $_GET['date'] ?? null;
$sortOrder = $_GET['sortOrder'] ?? 'asc';  // Default to ascending

// Prepare SQL query
if ($date) {
    $sql = "SELECT id, date_time, event_title, event_description FROM events WHERE DATE(date_time) = ? ORDER BY date_time " . ($sortOrder === 'desc' ? 'DESC' : 'ASC');
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $date);
} else {
    $sql = "SELECT id, date_time, event_title, event_description FROM events ORDER BY date_time " . ($sortOrder === 'desc' ? 'DESC' : 'ASC');
    $stmt = $conn->prepare($sql);
}

// Execute query
$stmt->execute();
$result = $stmt->get_result();

// Check if events exist
if ($result->num_rows > 0) {
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    echo json_encode([
        'status' => 'success',
        'events' => $events
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No events found'
    ]);
}

// Close resources
$stmt->close();
$conn->close();
?>
