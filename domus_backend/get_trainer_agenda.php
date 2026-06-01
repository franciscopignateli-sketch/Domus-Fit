<?php
require 'db.php';

if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    try {
        // 1. Descobrir qual é o ID interno do treinador associado a esta conta
        $stmtTrainer = $pdo->prepare("SELECT id FROM trainers WHERE user_id = ?");
        $stmtTrainer->execute([$user_id]);
        $trainer = $stmtTrainer->fetch(PDO::FETCH_ASSOC);

        if (!$trainer) {
            echo json_encode(["success" => false, "message" => "Perfil de treinador não encontrado para este utilizador."]);
            exit;
        }

        $trainer_id = $trainer['id'];

        // 2. Ir buscar apenas as aulas deste treinador e contar quantas pessoas já marcaram
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