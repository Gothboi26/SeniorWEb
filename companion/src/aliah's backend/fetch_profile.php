<?php
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$conn = new mysqli("localhost", "root", "", "account");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Not authenticated"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch all necessary fields from users table
$stmt = $conn->prepare("
    SELECT 
        id, username, email_address, password, number, age, sex, address, health_issue,
        created_at, barangay_id, group_chapter,
        first_name, middle_name, last_name, extension, birthday, civil_status,
        emergency_contact_person, emergency_contact_number, emergency_contact_relationship,
        profile_picture
    FROM users 
    WHERE id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "User not found"]);
}
?>
