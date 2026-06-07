<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->username) && isset($data->email) && isset($data->password) && isset($data->specialty)) {
    
    $name = trim($data->name);
    $username = trim($data->username);
    $email = trim($data->email);
    // Uso do BCRYPT para encriptação da password
    $password = password_hash($data->password, PASSWORD_BCRYPT); 
    $specialty = trim($data->specialty);
    $role = 'trainer';

    try {
        // Iniciar transação. Impede que a conta seja criada se o perfil do treinador falhar (ou vice-versa).
        $pdo->beginTransaction();

        $stmtUser = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmtUser->execute([$name, $username, $email, $password, $role]);
        
        // Recuperar o ID do utilizador acabado de inserir para usar como foreign key
        $user_id = $pdo->lastInsertId();

        $stmtTrainer = $pdo->prepare("INSERT INTO trainers (name, specialty, user_id) VALUES (?, ?, ?)");
        $stmtTrainer->execute([$name, $specialty, $user_id]);

        // Efetivar ambas as inserções
        $pdo->commit();
        
        echo json_encode(["success" => true, "message" => "Treinador e conta criados com sucesso!"]);
    } catch (PDOException $e) {
        // Rollback cancela tudo se ocorrer um erro a meio do processo
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Erro ao criar: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
}
?>