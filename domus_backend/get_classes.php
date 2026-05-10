<?php

require 'db.php';

// Vai buscar as aulas que ainda não aconteceram, o nome do treinador e conta quantas reservas já existem
$sql = "SELECT c.id, c.name AS class_name, c.class_datetime, c.max_capacity,
               t.name AS trainer_name,
               (SELECT COUNT(*) FROM bookings b WHERE b.class_id = c.id) AS current_bookings
        FROM classes c
        JOIN trainers t ON c.trainer_id = t.id
        WHERE c.class_datetime >= NOW()
        ORDER BY c.class_datetime ASC";

$stmt = $pdo->query($sql);
$classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "classes" => $classes]);
?>