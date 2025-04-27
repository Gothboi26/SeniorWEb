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

// ✅ Check if user is logged in
if (!isset($_SESSION["user_id"])) {
    error_log("Session not found. Cookies: " . print_r($_COOKIE, true));
    echo json_encode(["status" => "error", "message" => "Not logged in."]);
    exit();
}

// ✅ Fetch latest 5 pending appointments and emergencies
try {
    $response = [
        "appointments" => [],
        "emergencies" => []
    ];

    // ✅ Fetch latest 5 pending appointments
    $stmt1 = $pdo->query("SELECT id, date, service, status FROM appointments WHERE status = 'pending' ORDER BY date DESC LIMIT 5");
    $response["appointments"] = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // ✅ Fetch latest 5 pending emergencies
    $stmt2 = $pdo->query("SELECT id, date_reported AS date, type AS emergency_type, status FROM emergencies WHERE status = 'pending' ORDER BY date_reported DESC LIMIT 5");
    $response["emergencies"] = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    exit();
}
?>
