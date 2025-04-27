<?php
session_start();
require_once "headers.php";
require_once "connection.php"; // <-- this sets up $pdo


// ✅ Get today's date
$today = date("Y-m-d");

// ✅ Query future & today's slots only
$stmt = $conn->prepare("SELECT id, service_name, date, time, max_slots 
                        FROM service_slots 
                        WHERE date >= ? 
                        ORDER BY date ASC, time ASC");
$stmt->bind_param("s", $today);
$stmt->execute();
$result = $stmt->get_result();

// ✅ Format result
$slots = [];
while ($row = $result->fetch_assoc()) {
    $row['max_slots'] = (int)$row['max_slots']; // ensure numeric
    $slots[] = $row;
}

echo json_encode($slots);
?>
