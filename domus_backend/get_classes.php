<?php
require 'db.php';

// Verifica se o React enviou o ID do utilizador (pode não enviar se não houver login)
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

$sql = "SELECT c.id, c.name AS class_name, c.class_datetime, c.max_capacity,
               t.name AS trainer_name,
               (SELECT COUNT(*) FROM bookings b WHERE b.class_id = c.id) AS current_bookings,
               (SELECT COUNT(*) FROM bookings b2 WHERE b2.class_id = c.id AND b2.user_id = ?) AS is_booked
        FROM classes c
        JOIN trainers t ON c.trainer_id = t.id
        WHERE c.class_datetime >= NOW()
        ORDER BY c.class_datetime ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]); // Passamos o user_id para a query
$classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "classes" => $classes]);
?>