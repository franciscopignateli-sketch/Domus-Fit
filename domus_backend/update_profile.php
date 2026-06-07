<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id)) {
    $id = intval($data->user_id);
    $name = trim($data->name);
    $photo = trim($data->photo);

    // Lógica condicional: a coluna da password só é atualizada se o payload incluir uma nova.
    // Preserva a integridade da password atual nas edições de perfil padrão.
    if (!empty($data->password)) {
        $hash = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET name = ?, photo = ?, password = ? WHERE id = ?");
        $success = $stmt->execute([$name, $photo, $hash, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, photo = ? WHERE id = ?");
        $success = $stmt->execute([$name, $photo, $id]);
    }

    if ($success) {
        echo json_encode(["success" => true, "message" => "Perfil atualizado com sucesso."]);
    } else {
        echo json_encode(["success" => false, "message" => "Falha na atualização do perfil."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID do utilizador em falta."]);
}
?>