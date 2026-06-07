<?php
require 'db.php';

if (isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);

    try {
        $stmt = $pdo->prepare("SELECT id, name, username, email, photo, plan_name, plan_expires, role FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            echo json_encode(["success" => false, "message" => "Utilizador não encontrado."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erro na base de dados: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Falta o ID do utilizador."]);
}
?>