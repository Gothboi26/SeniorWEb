<?php
session_start();

// ✅ CORS Headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");

// ✅ Handle preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ✅ DB Connection
$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
  echo json_encode(["error" => "Database connection failed"]);
  exit();
}

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

// ✅ Save profile picture only
$stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
$stmt->bind_param("si", $profilePicture, $user_id);

if ($stmt->execute()) {
  echo json_encode(["message" => "Profile picture uploaded successfully!"]);
} else {
  echo json_encode(["error" => "Failed to upload profile picture."]);
}

$stmt->close();
$conn->close();
?>
