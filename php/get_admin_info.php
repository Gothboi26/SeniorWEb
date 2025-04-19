<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// ✅ Connect to DB
$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// ✅ Check for session
if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Not authenticated"]);
    exit;
}

$username = $_SESSION['username'];

// ✅ Fetch all required fields (include profile_photo)
$sql = "SELECT username, email_address, address, number, city, state, profile_photo FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row); // Send full row including profile_photo
} else {
    echo json_encode(["error" => "Admin not found"]);
}
?>
