<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->class_id)) {
    $user_id = $data->user_id;
    $class_id = $data->class_id;

    // Verificar capacidade máxima vs reservas atuais usando uma subquery na mesma chamada
    $stmt = $pdo->prepare("SELECT max_capacity, (SELECT COUNT(*) FROM bookings WHERE class_id = ?) as current_bookings FROM classes WHERE id = ?");
    $stmt->execute([$class_id, $class_id]);
    $classData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$classData) {
        echo json_encode(["success" => false, "message" => "Aula não encontrada."]);
        exit;
    }

    // Validação de lotação no backend (evita overbooking se 2 pessoas clicarem ao mesmo tempo)
    if ($classData['current_bookings'] >= $classData['max_capacity']) {
        echo json_encode(["success" => false, "message" => "Aula esgotada."]);
        exit;
    }

    try {
        $insert = $pdo->prepare("INSERT INTO bookings (user_id, class_id) VALUES (?, ?)");
        $insert->execute([$user_id, $class_id]);
        echo json_encode(["success" => true, "message" => "Reserva efetuada com sucesso!"]);
    } catch (PDOException $e) {
        // Apanhar o erro 23000 de restrição UNIQUE da base de dados para evitar inscrições duplicadas
        if ($e->getCode() == 23000) {
            echo json_encode(["success" => false, "message" => "Já tens o teu lugar marcado nesta aula!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao reservar aula."]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Dados em falta."]);
}
?>