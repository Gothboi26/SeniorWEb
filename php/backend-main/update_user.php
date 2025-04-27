<?php
require_once "headers.php";
require_once "connection.php"; // uses $pdo

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$fields = [
    'username', 'number', 'age', 'sex', 'address', 'email_address',
    'barangay_id', 'group_chapter', 'health_issue', 'first_name', 'middle_name',
    'last_name', 'extension', 'birthday', 'civil_status', 'emergency_contact_person',
    'emergency_contact_number', 'emergency_contact_relationship'
];

$set_clauses = [];
$values = [];

// 🛠️ Build query dynamically
foreach ($fields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["status" => "error", "message" => "Missing field: $field"]);
        exit;
    }
    $set_clauses[] = "$field = :$field";
    $values[":$field"] = $data[$field];
}

// Optional: include password if updating
if (!empty($data["password"])) {
    $set_clauses[] = "password = :password";
    $values[":password"] = password_hash($data["password"], PASSWORD_DEFAULT);
}

$values[":id"] = $data["id"];
$set_clause_str = implode(", ", $set_clauses);

try {
    $stmt = $pdo->prepare("UPDATE users SET $set_clause_str WHERE id = :id");
    $stmt->execute($values);
    echo json_encode(["status" => "success", "message" => "User updated successfully."]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $e->getMessage()]);
}
?>
