<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "aliah1234";
$dbname = "accounts";

$conn = new mysqli($servername, $username, $password, $dbname);

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password']) || !isset($data['role'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit();
}

$username = $data['username'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);
$role = $data['role'];

$sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $username, $password, $role);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Username already exists']);
}

$stmt->close();
$conn->close();
?>