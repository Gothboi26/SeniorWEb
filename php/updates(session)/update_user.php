<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$username = "root";
$password = "";
$database = "";

$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET username=?, age=?, sex=?, address=?, email_address=?, barangay_id=?, group_chapter=?, health_issue=? WHERE id=?");
$stmt->bind_param(
    "sissssssi",
    $data['username'],
    $data['age'],
    $data['sex'],
    $data['address'],
    $data['email_address'],
    $data['barangay_id'],
    $data['group_chapter'],
    $data['health_issue'],
    $data['id']
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update user"]);
}
$stmt->close();
$conn->close();
?>
