<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Parse JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input or missing ID."]);
    exit;
}

// Required fields (excluding password)
$required = [
    "username", "number", "age", "sex", "address", "lat", "lng", "email_address",
    "barangay_id", "group_chapter", "health_issue", "first_name", "last_name",
    "birthday", "civil_status", "emergency_contact_person", "emergency_contact_number",
    "emergency_contact_relationship"
];

foreach ($required as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === "") {
        echo json_encode(["status" => "error", "message" => "Missing field: $field"]);
        exit;
    }
}

// Specific validations
if (strlen($data["barangay_id"]) !== 5) {
    echo json_encode(["status" => "error", "message" => "Barangay ID must be exactly 5 digits."]);
    exit;
}
if (strlen($data["number"]) !== 11 || strlen($data["emergency_contact_number"]) !== 11) {
    echo json_encode(["status" => "error", "message" => "Phone numbers must be exactly 11 digits."]);
    exit;
}
if ((int)$data["age"] < 60) {
    echo json_encode(["status" => "error", "message" => "Age must be 60 or older."]);
    exit;
}

// Optional fields
$middle_name = $data["middle_name"] ?? '';
$extension = $data["extension"] ?? '';

// Prepare update statement
$stmt = $conn->prepare("
    UPDATE users SET 
        username = ?, number = ?, age = ?, sex = ?, address = ?, lat = ?, lng = ?, email_address = ?,
        barangay_id = ?, group_chapter = ?, health_issue = ?, first_name = ?, middle_name = ?,
        last_name = ?, extension = ?, birthday = ?, civil_status = ?, emergency_contact_person = ?,
        emergency_contact_number = ?, emergency_contact_relationship = ?
    WHERE id = ?
");

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

// Bind params
$stmt->bind_param(
    "ssissddsssssssssssssi",
    $data["username"], $data["number"], $data["age"], $data["sex"], $data["address"],
    $data["lat"], $data["lng"], $data["email_address"], $data["barangay_id"],
    $data["group_chapter"], $data["health_issue"], $data["first_name"], $middle_name,
    $data["last_name"], $extension, $data["birthday"], $data["civil_status"],
    $data["emergency_contact_person"], $data["emergency_contact_number"],
    $data["emergency_contact_relationship"], $data["id"]
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
