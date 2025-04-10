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
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch user and emergency contact details
    $stmt = $pdo->prepare("
        SELECT 
            u.username,
            u.address,
            u.number AS user_number,
            p.emergencyContactPerson AS emergency_contact_name,
            p.contactNumber AS emergency_contact_number
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
        empty($profile["user_number"]) ||
        empty($profile["emergency_contact_name"]) ||
        empty($profile["emergency_contact_number"])
    ) {
        echo json_encode(["success" => false, "error" => "missing_profile"]);
        exit;
    }

    // Insert emergency record
    $insert = $pdo->prepare("
        INSERT INTO emergencies (
            user_id, username, full_name, emergency_contact_name, emergency_contact_number, user_number, type, location, status, date_reported
        ) VALUES (
            :user_id, :username, :full_name, :emergency_contact_name, :emergency_contact_number, :user_number, :type, :location, 'Ongoing', NOW()
        )
    ");

    $insert->execute([
        ":user_id" => $user_id,
        ":username" => $profile["username"],
        ":full_name" => $profile["username"], // same as username
        ":emergency_contact_name" => $profile["emergency_contact_name"],
        ":emergency_contact_number" => $profile["emergency_contact_number"],
        ":user_number" => $profile["user_number"],
        ":type" => $type,
        ":location" => $profile["address"]
    ]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
