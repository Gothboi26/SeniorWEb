<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "accounts";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Query to fetch users
$sql = "SELECT username, role FROM users";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    echo json_encode([
        "status" => "success",
        "data" => $result->fetch_all(MYSQLI_ASSOC)
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No users found or query failed."
    ]);
}

// Close connection
$conn->close();
?>
