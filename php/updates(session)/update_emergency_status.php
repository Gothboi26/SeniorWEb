<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Allow only logged in users (optional)
if (!isset($_SESSION['user_id']) && !isset($_SESSION['username'])) {
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

// ✅ Connect to database
$pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ✅ Read input
$input = json_decode(file_get_contents("php://input"), true);
$id = $input["id"] ?? null;
$status = $input["status"] ?? null;

// ✅ Validate allowed statuses
$allowedStatuses = ["Ongoing", "Resolved"];
if (!in_array($status, $allowedStatuses)) {
    echo json_encode(["success" => false, "error" => "Invalid status value"]);
    exit;
}

// ✅ Update status
try {
    $stmt = $pdo->prepare("UPDATE emergencies SET status = :status WHERE id = :id");
    $stmt->execute([
        ":status" => $status,
        ":id" => $id
    ]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "DB error: " . $e->getMessage()]);
}
