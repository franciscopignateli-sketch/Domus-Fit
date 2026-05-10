<?php

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->class_id)) {
    $stmt = $pdo->prepare("DELETE FROM bookings WHERE user_id = ? AND class_id = ?");
    
    if ($stmt->execute([$data->user_id, $data->class_id])) {
        echo json_encode(["success" => true, "message" => "Reserva cancelada."]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao cancelar."]);
    }
}
?>