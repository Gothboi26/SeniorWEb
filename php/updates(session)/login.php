<?php
session_start(); // Start the session

// ✅ CORS setup for localhost:3000
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Database Connection
$conn = new mysqli("localhost", "root", "", "accnt");

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// ✅ Add default admin if not exists
$default_username = "admin";
$default_password = password_hash("admin123", PASSWORD_DEFAULT);
$default_role = "admin";

$sql = "INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $default_username, $default_password, $default_role);
$stmt->execute();
$stmt->close();

// ✅ Get request data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing username or password']);
    exit();
}

$username = $data['username'];
$password = $data['password'];

// ✅ Fetch user info
$sql = "SELECT id, password, role FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($user_id, $hashed_password, $role);

if ($stmt->fetch() && password_verify($password, $hashed_password)) {
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $username;
    $_SESSION['role'] = $role;

    session_write_close();

    echo json_encode([
        'status' => 'success',
        'role' => $role,
        'message' => 'Login successful',
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
}

$stmt->close();
$conn->close();
?>
