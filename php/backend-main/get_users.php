<?php
require_once "headers.php";
require_once "connection.php"; // <-- sets up $pdo

if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $user_id = intval($_GET['id']);
    $stmt = $pdo->prepare("
        SELECT 
            id, username, number, age, sex, address, health_issue, email_address, 
            barangay_id, group_chapter, role,
            first_name, middle_name, last_name, extension, birthday, civil_status,
            emergency_contact_person, emergency_contact_number, emergency_contact_relationship, created_at
        FROM users WHERE id = :id
    ");
    $stmt->execute(['id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["status" => "success", "user" => $user]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found."]);
    }
} else {
    $stmt = $pdo->query("
        SELECT 
            id, username, number, age, sex, address, health_issue, email_address, 
            barangay_id, group_chapter, role,
            first_name, middle_name, last_name, extension, birthday, civil_status,
            emergency_contact_person, emergency_contact_number, emergency_contact_relationship, created_at
        FROM users
    ");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($users) {
        echo json_encode(["status" => "success", "data" => $users]);
    } else {
        echo json_encode(["status" => "error", "message" => "No users found."]);
    }
}

// No need to close PDO, it auto-closes 😎
?>
