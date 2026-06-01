<?php
require 'db.php';

if (isset($_GET['user_id'])) {
    $stmt = $pdo->prepare("SELECT id, name, username, email, plan_name, plan_expires, photo FROM users WHERE id = ?");
    $stmt->execute([$_GET['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Utilizador não encontrado."]);
    }
}
?>