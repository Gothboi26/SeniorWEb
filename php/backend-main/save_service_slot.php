<?php
session_start();
require_once "headers.php";
require_once "connection.php"; // this sets up $pdo

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? null;
$name = $data["name"] ?? '';
$date = $data["date"] ?? '';
$time = $data["time"] ?? '';
$maxSlot = (int)($data["maxSlot"] ?? 0);

if (!$name || !$date || !$time || $maxSlot < 1) {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit();
}

if ($id) {
    // EDIT MODE (with ID)
    $check = $conn->prepare("SELECT id FROM service_slots WHERE service_name = ? AND date = ? AND time = ? AND id != ?");
    $check->bind_param("sssi", $name, $date, $time, $id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["status" => "duplicate", "message" => "Duplicate service slot exists."]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE service_slots SET service_name = ?, date = ?, time = ?, max_slots = ? WHERE id = ?");
    $stmt->bind_param("sssii", $name, $date, $time, $maxSlot, $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "mode" => "updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }

} else {
    // ADD MODE
    $check = $conn->prepare("SELECT id FROM service_slots WHERE service_name = ? AND date = ? AND time = ?");
    $check->bind_param("sss", $name, $date, $time);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["status" => "duplicate", "message" => "Duplicate service slot"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO service_slots (service_name, date, time, max_slots) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $name, $date, $time, $maxSlot);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "mode" => "inserted", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}
?>
