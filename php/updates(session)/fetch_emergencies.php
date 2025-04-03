<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sampol";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  echo json_encode(["error" => "Database connection failed"]);
  exit;
}

$sql = "SELECT id, full_name AS name, 
               DATE_FORMAT(date_reported, '%m-%d-%Y') AS date, 
               TIME_FORMAT(date_reported, '%h:%i %p') AS time, 
               type, location, contact_number, status 
        FROM emergencies 
        ORDER BY date_reported DESC";

$result = $conn->query($sql);

$emergencies = [];
while ($row = $result->fetch_assoc()) {
  $emergencies[] = $row;
}

echo json_encode($emergencies);
$conn->close();
?>
