<?php
session_start();
require_once "headers.php";
require_once "connection.php"; // <-- this sets up $pdo

if (isset($_SESSION['username'])) {
    echo json_encode(['username' => $_SESSION['username']]);
} else {
    echo json_encode(['username' => null]);
}