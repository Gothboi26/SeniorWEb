<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "account");
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit();
}

if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$username = $_SESSION["username"];

if (isset($_FILES["profile_photo"])) {
    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = time() . "_" . basename($_FILES["profile_photo"]["name"]);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["profile_photo"]["tmp_name"], $targetPath)) {
        $sql = "UPDATE users SET profile_photo = ? WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $targetPath, $username);
        $stmt->execute();
        echo json_encode(["success" => true, "photo_path" => $targetPath]);
    } else {
        echo json_encode(["error" => "Upload failed"]);
    }
} else {
    echo json_encode(["error" => "No file uploaded"]);
}
?>
