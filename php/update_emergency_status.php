<?php
session_start();

// ✅ CORS and Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Handle preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Auth check
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

// ✅ Get data from POST
$input = json_decode(file_get_contents("php://input"), true);
$id = isset($input["id"]) ? intval($input["id"]) : 0;
$status = isset($input["status"]) ? trim($input["status"]) : "";

$allowedStatuses = ["Pending", "On the way", "Arrived", "Resolved"];

if ($id <= 0 || !in_array($status, $allowedStatuses)) {
    echo json_encode(["success" => false, "error" => "Invalid ID or status"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // ✅ Update emergency status
    $stmt = $pdo->prepare("UPDATE emergencies SET status = :status WHERE id = :id");
    $stmt->execute([
        ":status" => $status,
        ":id" => $id
    ]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
