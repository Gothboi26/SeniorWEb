<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// DB connection
$host = "localhost";
$username = "root";
$password = "";
$database = "account";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get JSON POST data
$data = json_decode(file_get_contents("php://input"), true);

// Retrieve and sanitize input
$username = $data["username"] ?? '';
$password = $data["password"] ?? '';
$number = $data["number"] ?? ''; // New field for number
$age = $data["age"] ?? '';
$sex = $data["sex"] ?? '';
$address = $data["address"] ?? '';
$health_issue = $data["health_issue"] ?? '';
$email_address = $data["email_address"] ?? '';
$barangay_id = $data["barangay_id"] ?? '';
$group_chapter = $data["group_chapter"] ?? '';

// Check required fields
if (
    !$username || !$password || !$number || !$age || !$sex || !$address ||
    !$health_issue || !$email_address || !$barangay_id || !$group_chapter
) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute insert
$stmt = $conn->prepare(
    "INSERT INTO users (username, password, number, age, sex, address, health_issue, email_address, barangay_id, group_chapter)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssisssssi",
    $username,
    $hashed_password,
    $number,
    $age,
    $sex,
    $address,
    $health_issue,
    $email_address,
    $barangay_id,
    $group_chapter
);

// Execute the statement
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

// Close the statement and the database connection
$stmt->close();
$conn->close();
?>

