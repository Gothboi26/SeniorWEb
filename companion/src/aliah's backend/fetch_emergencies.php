<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$pdo = new PDO("mysql:host=localhost;dbname=account", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $pdo->query("
    SELECT 
        id,
        username AS name,
        full_name,
        emergency_contact_name,
        emergency_contact_number,
        user_number AS contact_number,
        type,
        location,
        status,
        DATE(date_reported) AS date,
        TIME(date_reported) AS time
    FROM emergencies
    ORDER BY date_reported DESC
");

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
