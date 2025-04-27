<?php
session_start();
require_once "headers.php";
require_once "connection.php"; // sets up $pdo

// ✅ Auth check
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
        try {
            $stmt = $pdo->prepare("UPDATE users SET profile_photo = :photo WHERE username = :username");
            $stmt->execute([
                ":photo" => $targetPath,
                ":username" => $username
            ]);
            echo json_encode(["success" => true, "photo_path" => $targetPath]);
        } catch (PDOException $e) {
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "Upload failed"]);
    }
} else {
    echo json_encode(["error" => "No file uploaded"]);
}
?>
