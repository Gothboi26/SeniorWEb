<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  echo json_encode(["error" => "Database connection failed"]);
  exit;
}

$sql = "SELECT id, full_name AS name, 
               DATE_FORMAT(created_at, '%m-%d-%Y') AS date, 
               TIME_FORMAT(created_at, '%h:%i %p') AS time, 
               type, location, notes, status 
        FROM emergency_reports 
        ORDER BY created_at DESC";

$result = $conn->query($sql);

$emergencies = [];
while ($row = $result->fetch_assoc()) {
  $emergencies[] = $row;
}

echo json_encode($emergencies);
$conn->close();
?>
