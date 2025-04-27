<?php
session_start();

// ✅ Include Headers
require_once "headers.php"; // Includes CORS and preflight handling

// ✅ Include Database Connection
require_once "connection.php"; // Sets up $pdo for DB connection

// ✅ Auth Check
if (!isset($_SESSION['user_id'])) {
  echo json_encode(["error" => "Not authenticated"]);
  exit();
}

$user_id = $_SESSION['user_id'];

// ✅ Parse input
$data = json_decode(file_get_contents("php://input"), true);
$profilePicture = $data['profilePicture'] ?? '';

if (!$profilePicture) {
  echo json_encode(["error" => "No profile picture provided."]);
  exit();
}

// ✅ Save profile picture only (PDO)
$stmt = $pdo->prepare("UPDATE users SET profile_picture = :profile_picture WHERE id = :user_id");
$stmt->bindValue(':profile_picture', $profilePicture, PDO::PARAM_STR);
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);

if ($stmt->execute()) {
  echo json_encode(["message" => "Profile picture uploaded successfully!"]);
} else {
  echo json_encode(["error" => "Failed to upload profile picture."]);
}
?>
