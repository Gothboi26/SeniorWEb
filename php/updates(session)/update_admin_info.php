<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit();
}

// Ensure admin is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

$email   = $data["email_address"]   ?? "";
$address = $data["address"] ?? "";
$number   = $data["number"]   ?? "";
$city    = $data["city"]    ?? "";
$state   = $data["state"]   ?? "";
$username = $_SESSION["username"];

// Update user info without fullname
$sql = "UPDATE users SET email_address=?, address=?, number=?, city=?, state=? WHERE username=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $email, $address, $number, $city, $state, $username);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to update"]);
}
?>
