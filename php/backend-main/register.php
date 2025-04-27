<?php
require_once "headers.php";
require_once "connection.php"; // this sets up $pdo

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the raw JSON input
$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    echo json_encode(["status" => "error", "message" => "Invalid form data."]);
    exit;
}

// Required fields
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
$emergency_contact_person = $input["emergency_contact_person"];
$emergency_contact_number = $input["emergency_contact_number"];
$emergency_contact_relationship = $input["emergency_contact_relationship"];

// Insert into the database
try {
    $stmt = $pdo->prepare("
        INSERT INTO users (
            username, password, number, age, sex, address, health_issue,
            email_address, barangay_id, group_chapter, first_name, middle_name, 
            last_name, extension, birthday, civil_status, emergency_contact_person,
            emergency_contact_number, emergency_contact_relationship
        ) VALUES (
            :username, :password, :number, :age, :sex, :address, :health_issue,
            :email, :barangay_id, :group_chapter, :first_name, :middle_name, 
            :last_name, :extension, :birthday, :civil_status, :emergency_contact_person,
            :emergency_contact_number, :emergency_contact_relationship
        )
    ");

    $stmt->execute([
        ":username" => $username,
        ":password" => $password,
        ":number" => $number,
        ":age" => $age,
        ":sex" => $sex,
        ":address" => $address,
        ":health_issue" => $health_issue,
        ":email" => $email,
        ":barangay_id" => $barangay_id,
        ":group_chapter" => $group_chapter,
        ":first_name" => $first_name,
        ":middle_name" => $middle_name,
        ":last_name" => $last_name,
        ":extension" => $extension,
        ":birthday" => $birthday,
        ":civil_status" => $civil_status,
        ":emergency_contact_person" => $emergency_contact_person,
        ":emergency_contact_number" => $emergency_contact_number,
        ":emergency_contact_relationship" => $emergency_contact_relationship
    ]);

    echo json_encode(["status" => "success", "message" => "User registered successfully."]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
