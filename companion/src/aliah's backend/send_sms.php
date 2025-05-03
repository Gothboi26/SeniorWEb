<?php
// ✅ CONFIGURATION
$phone_ip = "192.168.2.133";           // Your Android phone IP address
$port = "8082";                        // Traccar Gateway's port
$auth_token = "05518e3d-9b38-4675-9412-7440ce50831c";       // Replace with token from Traccar SMS Gateway app
$recipient = "+639054836642";          // Replace with your own number for testing
$message = "Hello! Your appointment has been approved."; // Customize message as needed

// ✅ API endpoint
$url = "http://$phone_ip:$port/send";

// ✅ Build POST data
$data = [
    "to" => $recipient,
    "message" => $message
];

// ✅ Authorization Header
$headers = [
    "Authorization: $auth_token"
];

// ✅ Send request using cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

// ✅ Output result
if ($error) {
    echo json_encode([
        "success" => false,
        "error" => $error
    ]);
} else {
    echo json_encode([
        "success" => true,
        "message" => "SMS sent successfully!",
        "response" => $response
    ]);
}
