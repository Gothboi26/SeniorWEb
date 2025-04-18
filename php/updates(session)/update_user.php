<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

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

$values = [];
$set_clauses = [];

foreach ($fields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["status" => "error", "message" => "Missing field: $field"]);
        exit;
    }
    $set_clauses[] = "$field = ?";
    $values[] = $data[$field];
}

// Optional: update password if provided
if (!empty($data["password"])) {
    $set_clauses[] = "password = ?";
    $values[] = password_hash($data["password"], PASSWORD_DEFAULT);
}

$set_clause_str = implode(", ", $set_clauses);
$values[] = $data["id"]; // Add user ID for WHERE clause

$stmt = $conn->prepare("UPDATE users SET $set_clause_str WHERE id = ?");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$types = str_repeat("s", count($values) - 1) . "i"; // All strings except last (id)
$stmt->bind_param($types, ...$values);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update user: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
