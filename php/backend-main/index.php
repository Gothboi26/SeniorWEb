<?php
// Allow CORS
require_once "headers.php";
// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if request is from a browser
if (isset($_SERVER['HTTP_USER_AGENT'])) {
    header("Location: login.php");
    exit();
}

// If API request (no user agent), return JSON
echo json_encode(["status" => "error", "message" => "Invalid request"]);
?>
