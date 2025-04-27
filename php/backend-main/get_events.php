<?php
session_start();
require_once "headers.php";
require_once "connection.php";

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle deletion of an event
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'] ?? $_GET['id'] ?? null;

        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM events WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Event deleted successfully'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing event ID for deletion'
            ]);
        }
        exit;
    }

    // Handle fetching events (GET request)
    $date = $_GET['date'] ?? null;
    $sortOrder = (isset($_GET['sortOrder']) && strtolower($_GET['sortOrder']) === 'desc') ? 'DESC' : 'ASC';

    if ($date) {
        $sql = "SELECT * FROM events WHERE DATE(date_time) = :date ORDER BY date_time $sortOrder";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':date' => $date]);
    } else {
        $sql = "SELECT * FROM events ORDER BY date_time $sortOrder";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }

    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'events' => $events
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
