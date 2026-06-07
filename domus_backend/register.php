<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->username) && isset($data->email) && isset($data->password)) {
    $name = trim($data->name);
    $username = trim($data->username);
    $email = trim($data->email);
    $password = $data->password;

    // Validações server-side estritas para assegurar a integridade dos dados 
    // mesmo que a validação do frontend seja contornada.
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "O formato do email é inválido."]);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode(["success" => false, "message" => "A password requer um mínimo de 6 caracteres."]);
        exit;
    }

    if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        echo json_encode(["success" => false, "message" => "O username deve conter apenas caracteres alfanuméricos ou underscores."]);
        exit;
    }

    // Prevenção de duplicação de registos cruciais
    $checkEmail = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkEmail->execute([$email]);
    if ($checkEmail->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "O email fornecido já se encontra registado."]);
        exit;
    }

    $checkUser = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $checkUser->execute([$username]);
    if ($checkUser->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "O username encontra-se indisponível."]);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$name, $username, $email, $hashed_password])) {
        echo json_encode(["success" => true, "message" => "Registo concluído com sucesso."]);
    } else {
        echo json_encode(["success" => false, "message" => "Falha no registo do utilizador."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
}
?>