<?php
// Configuring session cookie parameters
session_set_cookie_params([
    'lifetime' => 0, // Session cookie lasts until the browser is closed
    'path' => '/', // Cookie is available site-wide
    'domain' => 'seniorcare-flt3.onrender.com', // Update to your actual domain
    'secure' => true, // Ensures cookies are sent only over HTTPS
    'httponly' => true, // Helps prevent JavaScript from accessing the cookie
    'samesite' => 'None' // Important for cross-domain cookie sharing
]);
session_start();
require_once "headers.php";
require_once "connection.php"; // uses $pdo

// ✅ CORS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Auth check
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

// ✅ Incoming data
$input = json_decode(file_get_contents("php://input"), true);
$id = isset($input["id"]) ? intval($input["id"]) : 0;
$status = isset($input["status"]) ? trim($input["status"]) : "";

$allowedStatuses = ["Pending", "On the way", "Arrived", "Resolved"];

if ($id <= 0 || !in_array($status, $allowedStatuses)) {
    echo json_encode(["success" => false, "error" => "Invalid ID or status"]);
    exit;
}

try {
    // ✅ Update status
    $stmt = $pdo->prepare("UPDATE emergencies SET status = :status WHERE id = :id");
    $stmt->execute([
        ":status" => $status,
        ":id" => $id
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No matching emergency found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
