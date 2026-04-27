<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;

    // Procura o utilizador
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verifica se o utilizador existe e se a password coincide com a hash
    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true, 
            "message" => "Login com sucesso!", 
            "user" => ["name" => $user['name'], "email" => $user['email']]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Email ou password incorretos."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos."]);
}
?>