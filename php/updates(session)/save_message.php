<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "account");

$data = json_decode(file_get_contents("php://input"), true);

$sender = $data['sender'];
$receiver = $data['receiver'];
$content = $data['content'];

$stmt = $conn->prepare("INSERT INTO messages (sender, receiver, content) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $sender, $receiver, $content);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
