<?php
$host = "centerbeam.proxy.rlwy.net";
$dbname = "railway";
$username = "root";
$password = "LpXUbHmvaBSuHCHDvTwgFGEQzhxiUdzV";
$port = 55253;

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}
?>
