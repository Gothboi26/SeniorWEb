<?php
// Configuring session cookie parameters
session_set_cookie_params([
    'lifetime' => 0, // Session cookie lasts until the browser is closed
    'path' => '/', // Cookie is available site-wide
    'domain' => 'seniorcare-flt3.onrender.com', // Update to your actual domain
    'secure' => true, // Ensures cookies are sent only over HTTPS
    'httponly' => true, // Helps prevent JavaScript from accessing the cookie
    'samesite' => 'None' // Important for cross-domain cookie sharing
]);
session_start();
require_once "headers.php";
require_once "connection.php";

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
