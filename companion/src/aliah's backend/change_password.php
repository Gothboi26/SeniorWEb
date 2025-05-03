<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? "";
$newPassword = $data["newPassword"] ?? "";

if (!$username || !$newPassword) {
    echo json_encode(["status" => "error", "message" => "Missing username or password"]);
    exit();
}

$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $conn->prepare("UPDATE users SET password = ?, password_changed = 1 WHERE username = ?");
$stmt->bind_param("ss", $hashedPassword, $username);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Password updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update password"]);
}

$stmt->close();
$conn->close();
