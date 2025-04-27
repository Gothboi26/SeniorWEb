<?php
// ✅ Correct session cookie settings for Render
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'seniorcare-flt3.onrender.com', // ✅ your domain
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();

// ✅ Always include proper headers
require_once "headers.php";
require_once "connection.php"; // (connects to DB)

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

try {
    // ✅ Fetch latest emergency report by user
    $stmt = $pdo->prepare("
        SELECT status 
        FROM emergencies 
        WHERE user_id = ? 
        ORDER BY date_reported DESC 
        LIMIT 1
    ");
    $stmt->execute([$user_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode(["success" => true, "status" => $row["status"]]);
    } else {
        echo json_encode(["success" => false, "error" => "No emergency found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>
