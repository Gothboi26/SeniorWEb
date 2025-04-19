<?php
session_start();

// ✅ Set headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Session validation
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION["user_id"];
$input = json_decode(file_get_contents("php://input"), true);

// ✅ Validate input
$type = isset($input["type"]) ? trim($input["type"]) : null;
if (!$type) {
    echo json_encode(["success" => false, "error" => "Missing emergency type"]);
    exit;
}

try {
    // ✅ DB connection
    $pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // ✅ Fetch user info from users table
    $stmt = $pdo->prepare("
        SELECT 
            username,
            address,
            number AS user_number,
            CONCAT(first_name, ' ', middle_name, ' ', last_name, ' ', extension) AS full_name,
            emergency_contact_person,
            emergency_contact_number,
            lat,
            lng
        FROM users
        WHERE id = ?
    ");
    $stmt->execute([$user_id]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    // ✅ Check if user exists and has required info
    if (
        !$profile ||
        empty($profile["username"]) ||
        empty($profile["address"]) ||
        empty($profile["user_number"]) ||
        empty($profile["full_name"]) ||
        empty($profile["emergency_contact_person"]) ||
        empty($profile["emergency_contact_number"]) ||
        $profile["lat"] === null ||
        $profile["lng"] === null
    ) {
        echo json_encode(["success" => false, "error" => "missing_profile"]);
        exit;
    }

    // ✅ Insert emergency
    $insert = $pdo->prepare("
        INSERT INTO emergencies (
            user_id,
            username,
            full_name,
            emergency_contact_name,
            emergency_contact_number,
            user_number,
            type,
            location,
            latitude,
            longitude,
            status,
            date_reported
        ) VALUES (
            :user_id,
            :username,
            :full_name,
            :emergency_contact_name,
            :emergency_contact_number,
            :user_number,
            :type,
            :location,
            :latitude,
            :longitude,
            'Pending',
            NOW()
        )
    ");

    $insert->execute([
        ":user_id" => $user_id,
        ":username" => $profile["username"],
        ":full_name" => $profile["full_name"],
        ":emergency_contact_name" => $profile["emergency_contact_person"],
        ":emergency_contact_number" => $profile["emergency_contact_number"],
        ":user_number" => $profile["user_number"],
        ":type" => $type,
        ":location" => $profile["address"],
        ":latitude" => $profile["lat"],
        ":longitude" => $profile["lng"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Emergency submitted successfully",
        "status" => "Pending"
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
