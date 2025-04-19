<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "account");

$sender = $_GET['sender'];
$receiver = $_GET['receiver'];

$stmt = $conn->prepare("
  SELECT sender, receiver, content, timestamp
  FROM messages
  WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
  ORDER BY timestamp ASC
");

$stmt->bind_param("ssss", $sender, $receiver, $receiver, $sender);
$stmt->execute();

$result = $stmt->get_result();
$messages = [];

while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}

$profilePicture = null;
if ($receiver !== 'admin') {
    $stmt2 = $conn->prepare("SELECT profile_picture FROM users WHERE username = ?");
    $stmt2->bind_param("s", $receiver);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    if ($user = $res2->fetch_assoc()) {
        $profilePicture = $user['profile_picture'];
    }
}

echo json_encode([
  "messages" => $messages,
  "profile_picture" => $profilePicture
]);
