<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "aliah1234", "accounts");

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

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
    // Output the stored hashed password for debugging (remove after checking)
    // echo json_encode(['status' => 'debug', 'stored_password' => $hashed_password]);
    
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