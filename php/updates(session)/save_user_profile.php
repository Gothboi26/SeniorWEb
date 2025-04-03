<?php
session_start();

// ✅ CORS HEADERS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");

// ✅ Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ✅ Database connection
$conn = new mysqli("localhost", "root", "", "");
if ($conn->connect_error) {
  echo json_encode(["error" => "Database connection failed"]);
  exit();
}

// ✅ Authentication check
if (!isset($_SESSION['user_id'])) {
  echo json_encode(["error" => "Not authenticated"]);
  exit();
}

$user_id = $_SESSION['user_id'];

// ✅ Get and decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// ✅ Sanitize and extract input fields
$firstName = $data['firstName'] ?? '';
$middleName = $data['middleName'] ?? '';
$lastName = $data['lastName'] ?? '';
$extensionName = $data['extensionName'] ?? '';
$birthday = $data['birthday'] ?? '';
$age = isset($data['age']) ? (int)$data['age'] : 0;
$sex = $data['sex'] ?? '';
$civilStatus = $data['civilStatus'] ?? '';
$emergencyContactPerson = $data['emergencyContactPerson'] ?? '';
$contactNumber = $data['contactNumber'] ?? '';
$relationship = $data['relationship'] ?? '';
$address = $data['address'] ?? '';
$profilePicture = $data['profilePicture'] ?? '';

// ✅ Check if profile exists
$check = $conn->prepare("SELECT id FROM user_profile WHERE user_id = ?");
$check->bind_param("i", $user_id);
$check->execute();
$checkResult = $check->get_result();

// ✅ UPDATE or INSERT logic
if ($checkResult->num_rows > 0) {
  // Update existing
  $stmt = $conn->prepare("
    UPDATE user_profile 
    SET firstName = ?, middleName = ?, lastName = ?, extensionName = ?, 
        birthday = ?, age = ?, sex = ?, civilStatus = ?, 
        emergencyContactPerson = ?, contactNumber = ?, relationship = ?, 
        address = ?, profilePicture = ?
    WHERE user_id = ?
  ");

  $stmt->bind_param(
    "sssssiissssssi",
    $firstName,
    $middleName,
    $lastName,
    $extensionName,
    $birthday,
    $age,
    $sex,
    $civilStatus,
    $emergencyContactPerson,
    $contactNumber,
    $relationship,
    $address,
    $profilePicture,
    $user_id
  );
} else {
  // Insert new
  $stmt = $conn->prepare("
    INSERT INTO user_profile (
      user_id, firstName, middleName, lastName, extensionName, 
      birthday, age, sex, civilStatus, 
      emergencyContactPerson, contactNumber, relationship, 
      address, profilePicture
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ");

  $stmt->bind_param(
    "isssssiissssss",
    $user_id,
    $firstName,
    $middleName,
    $lastName,
    $extensionName,
    $birthday,
    $age,
    $sex,
    $civilStatus,
    $emergencyContactPerson,
    $contactNumber,
    $relationship,
    $address,
    $profilePicture
  );
}

// ✅ Execute and respond
if ($stmt->execute()) {
  echo json_encode(["message" => "Profile saved successfully!"]);
} else {
  echo json_encode(["error" => "Failed to save profile."]);
}

$stmt->close();
$conn->close();
