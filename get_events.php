<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$dbname = "calendar_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
date_default_timezone_set('UTC');

$date = isset($_GET['date']) ? $_GET['date'] : '';

if (empty($date)) {
    echo json_encode(['error' => 'Date parameter is missing']);
    exit;
}

$sql = "SELECT * FROM events WHERE date = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$events = array();
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);

$stmt->close();
$conn->close();
?>
