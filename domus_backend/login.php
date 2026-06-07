<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->login_input) && isset($data->password)) {
    $login_input = trim($data->login_input);
    $password = $data->password;

    // A query suporta autenticação híbrida (email ou username).
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$login_input, $login_input]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificação de segurança da hash gerada no momento do registo.
    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true, 
            "message" => "Login efetuado com sucesso.", 
            "user" => [
                "id" => $user['id'], 
                "name" => $user['name'], 
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role'], 
                "photo" => $user['photo'] 
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Credenciais incorretas."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Parâmetros de autenticação em falta."]);
}
?>