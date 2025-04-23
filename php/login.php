<?php
session_start();

// 🔐 Set CORS and content headers
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

// ✅ DB Connection
$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Connection failed']);
    exit();
}

// ✅ Parse request
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// ✅ Fetch user including password_changed
$stmt = $conn->prepare("SELECT id, password, role, password_changed FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($user_id, $hashed_password, $role, $password_changed);

if ($stmt->fetch() && password_verify($password, $hashed_password)) {
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $username;
    $_SESSION['role'] = $role;

    session_write_close();

    // ✅ Log the value for debugging
    error_log("Login success for $username - password_changed = " . var_export($password_changed, true));

    echo json_encode([
        'status' => 'success',
        'username' => $username,
        'role' => $role,
        'force_change' => (int)$password_changed === 0, // ✅ Reliable comparison
        'message' => 'Login successful'
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
}

$stmt->close();
$conn->close();
?>
