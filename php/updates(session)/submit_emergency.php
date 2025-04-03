<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Not logged in."]);
    exit;
}

$user_id = $_SESSION["user_id"];
$input = json_decode(file_get_contents("php://input"), true);
$type = isset($input["type"]) ? trim($input["type"]) : null;

if (!$type) {
    echo json_encode(["success" => false, "error" => "Missing emergency type."]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=sampol", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get username, address from users + contactNumber from user_profile
    $stmt = $pdo->prepare("
        SELECT u.username, u.address, p.contactNumber
        FROM users u
        JOIN user_profile p ON u.id = p.user_id
        WHERE u.id = ?
    ");
    $stmt->execute([$user_id]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (
        !$profile ||
        empty($profile["username"]) ||
        empty($profile["address"]) ||
        empty($profile["contactNumber"])
    ) {
        echo json_encode(["success" => false, "error" => "missing_profile"]);
        exit;
    }

    $insert = $pdo->prepare("
        INSERT INTO emergencies (user_id, username, type, location, full_name, contact_number, status, date_reported)
        VALUES (:user_id, :username, :type, :location, :full_name, :contact_number, 'Ongoing', NOW())
    ");

    $insert->execute([
        ":user_id" => $user_id,
        ":username" => $profile["username"],
        ":type" => $type,
        ":location" => $profile["address"],
        ":full_name" => $profile["username"], // Using username as display name
        ":contact_number" => $profile["contactNumber"]
    ]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
