<?php
require 'db.php';

if (isset($_POST['user_id']) && isset($_FILES['photo'])) {
    $user_id = intval($_POST['user_id']);
    $file = $_FILES['photo'];

    $target_dir = "uploads/";
    
    // Verificação e criação automática do diretório de armazenamento.
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $extension = pathinfo($file["name"], PATHINFO_EXTENSION);
    
    // Injeção do timestamp no nome do ficheiro atua como estratégia de cache-busting.
    // Força os browsers a recarregar a imagem do perfil imediatamente após a alteração.
    $filename = "user_" . $user_id . "_" . time() . "." . $extension;
    $target_file = $target_dir . $filename;

    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        $photo_url = "http://localhost/domus_backend/" . $target_file;
        
        $stmt = $pdo->prepare("UPDATE users SET photo = ? WHERE id = ?");
        $stmt->execute([$photo_url, $user_id]);
        
        echo json_encode(["success" => true, "photo_url" => $photo_url]);
    } else {
        echo json_encode(["success" => false, "message" => "Falha ao gravar o ficheiro."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Parâmetros de upload inválidos."]);
}
?>