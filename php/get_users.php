<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed: " . $conn->connect_error]);
    exit;
}

if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $user_id = intval($_GET['id']);
    $stmt = $conn->prepare("
        SELECT 
            id, username, number, age, sex, address, health_issue, email_address, 
            barangay_id, group_chapter, role,
            first_name, middle_name, last_name, extension, birthday, civil_status,
            emergency_contact_person, emergency_contact_number, emergency_contact_relationship, created_at
        FROM users WHERE id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        echo json_encode(["status" => "success", "user" => $result->fetch_assoc()]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found."]);
    }
    $stmt->close();
} else {
    $sql = "
        SELECT 
            id, username, number, age, sex, address, health_issue, email_address, 
            barangay_id, group_chapter, role,
            first_name, middle_name, last_name, extension, birthday, civil_status,
            emergency_contact_person, emergency_contact_number, emergency_contact_relationship, created_at
        FROM users
    ";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        echo json_encode(["status" => "success", "data" => $result->fetch_all(MYSQLI_ASSOC)]);
    } else {
        echo json_encode(["status" => "error", "message" => "No users found."]);
    }
}

$conn->close();
?>
