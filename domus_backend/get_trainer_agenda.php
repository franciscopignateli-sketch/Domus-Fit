<?php
require 'db.php';

if (isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);

    try {
        // Primeiro mapeamos o utilizador logado para o respetivo registo técnico de treinador
        $stmtTrainer = $pdo->prepare("SELECT id FROM trainers WHERE user_id = ?");
        $stmtTrainer->execute([$user_id]);
        $trainer = $stmtTrainer->fetch(PDO::FETCH_ASSOC);

        if (!$trainer) {
            echo json_encode(["success" => false, "message" => "Perfil de treinador não encontrado."]);
            exit;
        }

        $trainer_id = $trainer['id'];

        // Extraímos as turmas apenas deste treinador com a contagem de lotação atualizada
        $stmtClasses = $pdo->prepare("
            SELECT 
                c.id, 
                c.name AS class_name, 
                c.class_datetime, 
                c.max_capacity,
                (SELECT COUNT(*) FROM bookings b WHERE b.class_id = c.id) AS booked_count
            FROM classes c
            WHERE c.trainer_id = ?
            ORDER BY c.class_datetime ASC
        ");
        
        $stmtClasses->execute([$trainer_id]);
        $classes = $stmtClasses->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "classes" => $classes]);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erro BD: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Falta o ID do utilizador."]);
}
?>