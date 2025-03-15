<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "accounts");

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// Add default admin account if it doesn't exist
$default_username = "admin";
$default_password = password_hash("admin123", PASSWORD_DEFAULT);
$default_role = "admin";

$sql = "INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'SQL statement preparation failed']);
    exit();
}

$stmt->bind_param("sss", $default_username, $default_password, $default_role);
$stmt->execute();
$stmt->close();

$data = json_decode(file_get_contents("php://input"), true);

// Log the received data for debugging
error_log("Received data: " . print_r($data, true));

// Ensure required fields are provided
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing username or password']);
    exit();
}

$username = $data['username'];
$password = $data['password'];

$sql = "SELECT password, role FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'SQL statement preparation failed']);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($hashed_password, $role);

// Debugging: Check if the username exists and retrieve the stored password
if ($stmt->fetch()) {
    // Log the stored hashed password for debugging
    error_log("Stored hashed password: " . $hashed_password);
    
    if (password_verify($password, $hashed_password)) {
        echo json_encode(['status' => 'success', 'role' => $role]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials (password mismatch)']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials (username not found)']);
}

$stmt->close();
$conn->close();
?>