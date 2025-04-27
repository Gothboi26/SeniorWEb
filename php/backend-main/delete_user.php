<?php
require_once "headers.php";
require_once "connection.php";


$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $data['id']);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User deleted"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete user"]);
}
$stmt->close();
$conn->close();
?>
