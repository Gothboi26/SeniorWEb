<?php
// ✅ Correct session cookie settings for Render
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'seniorcare-flt3.onrender.com', // ✅ your domain
    'secure' => true, // ✅ must be HTTPS
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();

// ✅ Always include proper headers
require_once "headers.php";
require_once "connection.php"; // (this connects to database, defines $pdo)

// ✅ Handle preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Check if user is logged in
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Not logged in."]);
    exit;
}

$user_id = $_SESSION["user_id"];
$input = json_decode(file_get_contents("php://input"), true);
$type = isset($input["type"]) ? trim($input["type"]) : null;

// ✅ Validate input
if (!$type) {
    echo json_encode(["success" => false, "error" => "Missing emergency type."]);
    exit;
}

try {
    // ✅ Fetch user profile info
    $stmt = $pdo->prepare("
        SELECT 
            username,
            address,
            number AS user_number,
            TRIM(CONCAT_WS(' ', first_name, middle_name, last_name, extension)) AS full_name,
            emergency_contact_person,
            emergency_contact_number
        FROM users
        WHERE id = ?
    ");
    $stmt->execute([$user_id]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (
        !$profile ||
        empty($profile["username"]) ||
        empty($profile["address"]) ||
        empty($profile["user_number"]) ||
        empty($profile["emergency_contact_person"]) ||
        empty($profile["emergency_contact_number"])
    ) {
        echo json_encode(["success" => false, "error" => "missing_profile"]);
        exit;
    }

    // ✅ Insert new emergency
    $status = 'Pending';

    $insert = $pdo->prepare("
        INSERT INTO emergencies (
            user_id, username, full_name,
            emergency_contact_name, emergency_contact_number,
            user_number, type, location, status, date_reported
        ) VALUES (
            :user_id, :username, :full_name,
            :emergency_contact_name, :emergency_contact_number,
            :user_number, :type, :location, :status, NOW()
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
        ":status" => $status
    ]);

    echo json_encode(["success" => true, "status" => $status]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>
