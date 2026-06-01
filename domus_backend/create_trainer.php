<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->username) && isset($data->email) && isset($data->password) && isset($data->specialty)) {
    
    $name = trim($data->name);
    $username = trim($data->username);
    $email = trim($data->email);
    $password = password_hash($data->password, PASSWORD_BCRYPT); // Hash segura
    $specialty = trim($data->specialty);
    $role = 'trainer';

    try {
        // Iniciar uma transação para garantir que ou cria ambos ou não cria nenhum
        $pdo->beginTransaction();

        // 1. Criar o utilizador na tabela 'users'
        $stmtUser = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmtUser->execute([$name, $username, $email, $password, $role]);
        
        // Apanhar o ID que a base de dados acabou de gerar para este utilizador
        $user_id = $pdo->lastInsertId();

        // 2. Criar o perfil do treinador na tabela 'trainers' associando o user_id
        $stmtTrainer = $pdo->prepare("INSERT INTO trainers (name, specialty, user_id) VALUES (?, ?, ?)");
        $stmtTrainer->execute([$name, $specialty, $user_id]);

        // Confirmar as alterações na base de dados
        $pdo->commit();
        
        echo json_encode(["success" => true, "message" => "Treinador e conta criados com sucesso!"]);
    } catch (PDOException $e) {
        // Se algo falhar, desfaz tudo para não deixar dados corrompidos
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Erro ao criar: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
}
?>