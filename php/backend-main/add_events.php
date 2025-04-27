<?php
require_once "headers.php";
require_once "connection.php";

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

try {
    if ($id) {
        // Update existing event
        $sql = "UPDATE events 
                SET organizer = :organizer, date_time = :date_time, event_title = :event_title, 
                    event_description = :event_description, location = :location
                WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':organizer' => $organizer,
            ':date_time' => $date_time,
            ':event_title' => $title,
            ':event_description' => $description,
            ':location' => $location,
            ':id' => $id
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Event updated successfully',
            'id' => $id
        ]);

    } else {
        // Insert new event
        $sql = "INSERT INTO events (organizer, date_time, event_title, event_description, location, created_at) 
                VALUES (:organizer, :date_time, :event_title, :event_description, :location, :created_at)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':organizer' => $organizer,
            ':date_time' => $date_time,
            ':event_title' => $title,
            ':event_description' => $description,
            ':location' => $location,
            ':created_at' => $created_at
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Event added successfully',
            'id' => $pdo->lastInsertId()
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database operation failed: ' . $e->getMessage()
    ]);
}
?>
