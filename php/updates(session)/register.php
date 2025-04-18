<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    echo json_encode(["status" => "error", "message" => "Invalid form data."]);
    exit;
}

$required = [
    "username", "password", "number", "age", "sex", "address", "health_issue",
    "email_address", "barangay_id", "group_chapter", "first_name", "last_name",
    "birthday", "civil_status", "emergency_contact_person", "emergency_contact_number",
    "emergency_contact_relationship"
];

foreach ($required as $field) {
    if (empty($input[$field])) {
        echo json_encode(["status" => "error", "message" => "Missing field: $field"]);
        exit;
    }
}

// Sanitize and assign values
$username = $input["username"];
$password = password_hash($input["password"], PASSWORD_DEFAULT);
$number = $input["number"];
$age = $input["age"];
$sex = $input["sex"];
$address = $input["address"];
$health_issue = $input["health_issue"];
$email = $input["email_address"];
$barangay_id = $input["barangay_id"];
$group_chapter = $input["group_chapter"];
$first_name = $input["first_name"];
$middle_name = $input["middle_name"] ?? '';
$last_name = $input["last_name"];
$extension = $input["extension"] ?? '';
$birthday = $input["birthday"];
$civil_status = $input["civil_status"];
$emergency_person = $input["emergency_contact_person"];
$emergency_number = $input["emergency_contact_number"];
$emergency_relation = $input["emergency_contact_relationship"];

$stmt = $conn->prepare("
    INSERT INTO users (
        username, password, number, age, sex, address, health_issue, email_address, 
        barangay_id, group_chapter, first_name, middle_name, last_name, extension, 
        birthday, civil_status, emergency_contact_person, emergency_contact_number, 
        emergency_contact_relationship, role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'client')
");

$stmt->bind_param(
    "sssisssssisssssssss",
    $username, $password, $number, $age, $sex, $address, $health_issue, $email,
    $barangay_id, $group_chapter, $first_name, $middle_name, $last_name, $extension,
    $birthday, $civil_status, $emergency_person, $emergency_number, $emergency_relation
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Insert failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
