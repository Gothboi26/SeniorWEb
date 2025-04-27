<?php
session_start();
require_once "headers.php";  // ✅ Import CORS headers
require_once "connection.php"; // ✅ Import PDO connection to Railway

// ✅ Handle request
$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? "";
$newPassword = $data["newPassword"] ?? "";

if (!$username || !$newPassword) {
    echo json_encode(["status" => "error", "message" => "Missing username or new password"]);
    exit();
}

// ✅ Hash new password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("UPDATE users SET password = :password, password_changed = 1 WHERE username = :username");
    $stmt->execute([
        ":password" => $hashedPassword,
        ":username" => $username
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "No user updated. Check username."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Server error: " . $e->getMessage()]);
}
?>
