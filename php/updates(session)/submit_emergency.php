<?php
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

// Verify user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// DB setup
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["type"]) || empty($data["location"]) || empty($data["contact_number"])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$type = $conn->real_escape_string($data["type"]);
$full_name = isset($data["full_name"]) ? $conn->real_escape_string($data["full_name"]) : "";
$contact_number = $conn->real_escape_string($data["contact_number"]);
$location = $conn->real_escape_string($data["location"]);
$notes = isset($data["notes"]) ? $conn->real_escape_string($data["notes"]) : "";

$sql = "INSERT INTO emergency_reports (user_id, type, full_name, contact_number, location, notes)
        VALUES ('$user_id', '$type', '$full_name', '$contact_number', '$location', '$notes')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>
