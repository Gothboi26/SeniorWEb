<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sampol"; // ✅ Replace with your actual DB name

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(array("success" => false, "error" => "Database connection failed: " . $conn->connect_error));
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"]) || !isset($data["status"])) {
    echo json_encode(array("success" => false, "error" => "Missing ID or status"));
    exit;
}

$id = (int)$data["id"];
$status = trim($data["status"]);

if (!in_array($status, array("Active", "Ongoing", "Resolved"))) {
    echo json_encode(array("success" => false, "error" => "Invalid status value"));
    exit;
}

$stmt = $conn->prepare("UPDATE emergencies SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => "Update failed: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
