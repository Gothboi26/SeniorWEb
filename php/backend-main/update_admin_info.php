<?php
session_start();
require_once "headers.php";
require_once "connection.php"; // sets up $pdo from here

$email   = $data["email_address"]   ?? "";
$address = $data["address"] ?? "";
$number   = $data["number"]   ?? "";
$city    = $data["city"]    ?? "";
$state   = $data["state"]   ?? "";
$username = $_SESSION["username"];

// Update user info without fullname
$sql = "UPDATE users SET email_address=?, address=?, number=?, city=?, state=? WHERE username=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $email, $address, $number, $city, $state, $username);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to update"]);
}
?>
