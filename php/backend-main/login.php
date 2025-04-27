<?php
session_start();
require_once "headers.php";
require_once "connection.php"; // this sets up $pdo

// ✅ Add default admin if not exists
$default_username = "admin";
$default_password = password_hash("admin123", PASSWORD_DEFAULT);
$default_role = "admin";

try {
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (username, password, role) VALUES (:username, :password, :role)");
    $stmt->execute([
        ":username" => $default_username,
        ":password" => $default_password,
        ":role" => $default_role
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error inserting default admin: " . $e->getMessage()]);
    exit();
}

// ✅ Get request data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing username or password']);
    exit();
}

$username = $data['username'];
$password = $data['password'];

// ✅ Fetch user info
try {
    $stmt = $pdo->prepare("SELECT id, password, role FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $username;
        $_SESSION['role'] = $user['role'];

        session_write_close();

        echo json_encode([
            'status' => 'success',
            'role' => $user['role'],
            'username' => $username,
            'message' => 'Login successful'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Login error: " . $e->getMessage()]);
}

// Debugging Session and Cookies
if (!isset($_SESSION["user_id"])) {
    error_log("Session not found. Cookies: " . print_r($_COOKIE, true));
    echo json_encode(["status" => "error", "message" => "Not logged in."]);
    exit;
}
?>
