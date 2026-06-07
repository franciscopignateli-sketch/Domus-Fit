<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->plan_name)) {
    $user_id = intval($data->user_id);
    $plan_name = $data->plan_name;

    // A delegação do cálculo da data de expiração para a base de dados (DATE_ADD) 
    // garante consistência de tempo, ignorando potenciais diferenças de fuso horário no servidor PHP.
    $sql = "UPDATE users SET plan_name = ?, plan_expires = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$plan_name, $user_id])) {
        $stmt2 = $pdo->prepare("SELECT plan_name, plan_expires FROM users WHERE id = ?");
        $stmt2->execute([$user_id]);
        $updatedUser = $stmt2->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true, 
            "message" => "Subscrição processada com sucesso.", 
            "plan_data" => $updatedUser
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Falha ao processar a subscrição."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Parâmetros inválidos."]);
}
?>