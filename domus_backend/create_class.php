<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->trainer_id) && isset($data->class_datetime) && isset($data->max_capacity)) {
    
    $name = trim($data->name);
    $trainer_id = $data->trainer_id;
    $class_datetime = $data->class_datetime;
    $max_capacity = $data->max_capacity;

    try {
        $stmt = $pdo->prepare("INSERT INTO classes (name, trainer_id, class_datetime, max_capacity) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $trainer_id, $class_datetime, $max_capacity]);
        
        echo json_encode(["success" => true, "message" => "Aula criada com sucesso!"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erro na base de dados: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Dados incompletos. Preencha todos os campos."]);
}
?>