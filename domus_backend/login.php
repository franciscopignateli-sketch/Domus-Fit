<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

// Esperamos receber "login_input" (que pode ser email ou username) e a password
if (isset($data->login_input) && isset($data->password)) {
    $login_input = trim($data->login_input);
    $password = $data->password;

    // Procura na BD se o input condiz com o email OU com o username
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$login_input, $login_input]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verifica a password contra a Hash guardada
    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true, 
            "message" => "Login com sucesso!", 
            "user" => [
                "id" => $user['id'], 
                "name" => $user['name'], 
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role'], // ADICIONADO AQUI
                "photo" => $user['photo'] // ADICIONADO AQUI
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Utilizador ou password incorretos."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos."]);
}
?>