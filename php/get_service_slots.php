<?php
session_start();

// ✅ CORS + Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ DB connection
$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["error" => "DB connection failed"]);
    exit();
}

// ✅ Query ALL slots (past, today, and future)
$stmt = $conn->prepare("SELECT id, service_name, date, time, max_slots 
                        FROM service_slots 
                        ORDER BY date ASC, time ASC");
$stmt->execute();
$result = $stmt->get_result();

// ✅ Format result
$slots = [];
while ($row = $result->fetch_assoc()) {
    $row['max_slots'] = (int)$row['max_slots']; // ensure numeric in JSON
    $slots[] = $row;
}

echo json_encode($slots);
?>
