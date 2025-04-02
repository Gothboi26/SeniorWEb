<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$username = "root";
$password = "";
$database = "accnt";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"] ?? '';
$password = $data["password"] ?? '';
$age = $data["age"] ?? '';
$sex = $data["sex"] ?? '';
$address = $data["address"] ?? '';
$health_issue = $data["health_issue"] ?? '';
$email_address = $data["email_address"] ?? '';
$barangay_id = $data["barangay_id"] ?? '';
$group_chapter = $data["group_chapter"] ?? '';

if (
    !$username || !$password || !$age || !$sex || !$address ||
    !$health_issue || !$email_address || !$barangay_id || !$group_chapter
) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare(
    "INSERT INTO users (username, password, age, sex, address, health_issue, email_address, barangay_id, group_chapter)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssissssis", $username, $hashed_password, $age, $sex, $address, $health_issue, $email_address, $barangay_id, $group_chapter);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
