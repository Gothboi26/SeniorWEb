<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$conn = new mysqli("localhost", "root", "", "");

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["error" => "Not authenticated"]);
  exit();
}

$user_id = $_SESSION['user_id'];

// Fetch fields from users table
$userQuery = $conn->prepare("SELECT barangay_id, group_chapter, age, sex, address FROM users WHERE id = ?");
$userQuery->bind_param("i", $user_id);
$userQuery->execute();
$userResult = $userQuery->get_result()->fetch_assoc();

// Fetch profile details from user_profile
$profileQuery = $conn->prepare("SELECT * FROM user_profile WHERE user_id = ?");
$profileQuery->bind_param("i", $user_id);
$profileQuery->execute();
$profileResult = $profileQuery->get_result()->fetch_assoc();

// Merge and return
$response = array_merge($userResult ?? [], $profileResult ?? []);
echo json_encode($response);
