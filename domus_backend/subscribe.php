<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->plan_name)) {
    $user_id = $data->user_id;
    $plan_name = $data->plan_name;

    // Atualiza o plano e define a data de validade para daqui a 30 dias usando o MySQL (DATE_ADD)
    $sql = "UPDATE users SET plan_name = ?, plan_expires = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$plan_name, $user_id])) {
        // Vai buscar os dados atualizados para devolver ao React
        $stmt2 = $pdo->prepare("SELECT plan_name, plan_expires FROM users WHERE id = ?");
        $stmt2->execute([$user_id]);
        $updatedUser = $stmt2->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true, 
            "message" => "Plano subscrito com sucesso!", 
            "plan_data" => $updatedUser
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao subscrever plano."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Dados em falta."]);
}
?>