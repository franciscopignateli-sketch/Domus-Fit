<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require 'db.php'; // Conecta à base de dados

// Recebe os dados do React em formato JSON
$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->email) && isset($data->password)) {
    $name = $data->name;
    $email = $data->email;
    // Encripta a password! NUNCA guardar em plain text.
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

    // Verifica se o email já existe
    $checkEmail = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkEmail->execute([$email]);
    
    if ($checkEmail->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Este email já está registado."]);
        exit;
    }

    // Insere o novo utilizador
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$name, $email, $hashed_password])) {
        echo json_encode(["success" => true, "message" => "Conta criada com sucesso!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao criar conta."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos."]);
}
?>