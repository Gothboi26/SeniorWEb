<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  echo json_encode(["error" => "Database connection failed"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["id"]) || empty($data["status"])) {
  echo json_encode(["error" => "Missing ID or status"]);
  exit;
}

$id = (int)$data["id"];
$status = $conn->real_escape_string($data["status"]);

$sql = "UPDATE emergency_reports SET status='$status' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>
