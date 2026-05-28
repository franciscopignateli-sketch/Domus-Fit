<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->username) && isset($data->email) && isset($data->password)) {
    $name = trim($data->name);
    $username = trim($data->username);
    $email = trim($data->email);
    $password = $data->password;

    // --- VALIDAÇÕES DO SERVER-SIDE ---
    
    // 1. Validar formato do email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "O formato do email introduzido não é válido."]);
        exit;
    }

    // 2. Validar tamanho da password
    if (strlen($password) < 6) {
        echo json_encode(["success" => false, "message" => "A password deve ter pelo menos 6 caracteres."]);
        exit;
    }

    // 3. Validar tamanho/formato do username (apenas letras, números e underscores)
    if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        echo json_encode(["success" => false, "message" => "O username deve ter entre 3 e 20 caracteres e apenas conter letras, números ou underscores (_)"]);
        exit;
    }

    // 4. Verificar se o email já existe
    $checkEmail = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkEmail->execute([$email]);
    if ($checkEmail->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Este email já está registado."]);
        exit;
    }

    // 5. Verificar se o username já existe
    $checkUser = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $checkUser->execute([$username]);
    if ($checkUser->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Este username já está em uso."]);
        exit;
    }

    // Se passou todas as validações, encripta e insere
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$name, $username, $email, $hashed_password])) {
        echo json_encode(["success" => true, "message" => "Conta criada com sucesso!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao criar conta no servidor."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
}
?>