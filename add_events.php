<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$date = $data['date'];
$event = $data['event'];

if (empty($date) || empty($event)) {
    echo json_encode(['status' => 'error', 'message' => 'Date or event is empty']);
    exit;
}

$sql = "INSERT INTO events (date, event) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $date, $event);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
