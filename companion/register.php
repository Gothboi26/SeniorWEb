<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database configuration
$host = "localhost";
$username = "root";
$password = "";
$database = "accounts";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Handle incoming data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["username"], $data["password"], $data["age"], $data["sex"], $data["address"], $data["healthIssue"], $data["role"])) {
    $username = $data["username"];
    $password = password_hash($data["password"], PASSWORD_BCRYPT);
    $age = $data["age"];
    $sex = $data["sex"];
    $address = $data["address"];
    $healthIssue = $data["healthIssue"];
    $role = $data["role"];

    // Prepare and execute SQL statement
    $stmt = $conn->prepare("INSERT INTO users (username, password, age, sex, address, health_issue, role) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssissss", $username, $password, $age, $sex, $address, $healthIssue, $role);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Senior added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add senior"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>
