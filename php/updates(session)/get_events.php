<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "";

// Establish connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Handle DELETE if POST method with ID is provided
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $_GET['id'] ?? $input['id'] ?? null;

    if ($id) {
        $deleteStmt = $conn->prepare("DELETE FROM events WHERE id = ?");
        $deleteStmt->bind_param("i", $id);
        if ($deleteStmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Event deleted successfully'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete event: ' . $deleteStmt->error
            ]);
        }
        $deleteStmt->close();
        $conn->close();
        exit;
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing event ID for deletion'
        ]);
        $conn->close();
        exit;
    }
}

// Handle GET request to fetch events
$date = isset($_GET['date']) ? $_GET['date'] : '';
$sortOrder = isset($_GET['sortOrder']) && strtolower($_GET['sortOrder']) === 'desc' ? 'DESC' : 'ASC';

if (!empty($date)) {
    $sql = "SELECT * FROM events WHERE DATE(date_time) = ? ORDER BY date_time $sortOrder";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $date);
} else {
    $sql = "SELECT * FROM events ORDER BY date_time $sortOrder";
    $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

$events = [];

while ($row = $result->fetch_assoc()) {
    $events[] = [
        'id' => $row['id'],
        'organizer' => $row['organizer'],
        'location' => $row['location'],
        'event_title' => $row['event_title'],
        'event_description' => $row['event_description'],
        'date_time' => $row['date_time'],
        'created_at' => $row['created_at']
    ];
}

echo json_encode([
    'status' => 'success',
    'events' => $events
]);

$stmt->close();
$conn->close();
?>
