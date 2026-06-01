<?php
require 'db.php';

// Permite o envio de ficheiros e dados via formulário (multipart/form-data)
if (isset($_POST['user_id']) && isset($_FILES['photo'])) {
    $user_id = $_POST['user_id'];
    $file = $_FILES['photo'];

    $target_dir = "uploads/";
    
    // Cria a pasta automaticamente se te tiveres esquecido de a criar
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    // Gerar um nome único para a foto (ex: user_1_16238472.jpg)
    $extension = pathinfo($file["name"], PATHINFO_EXTENSION);
    $filename = "user_" . $user_id . "_" . time() . "." . $extension;
    $target_file = $target_dir . $filename;

    // Move o ficheiro temporário para a pasta de uploads
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // O link que o React vai ler
        $photo_url = "http://localhost/domus_backend/" . $target_file;
        
        // Atualiza a base de dados com o novo link
        $stmt = $pdo->prepare("UPDATE users SET photo = ? WHERE id = ?");
        $stmt->execute([$photo_url, $user_id]);
        
        echo json_encode(["success" => true, "photo_url" => $photo_url]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao guardar ficheiro no servidor."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Ficheiro ou ID em falta."]);
}
?>