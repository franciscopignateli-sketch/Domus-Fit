<?php
require 'db.php';

if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    // Adicionado c.id AS class_id para podermos usá-lo no botão de cancelar
    $sql = "SELECT 
                b.id AS booking_id, 
                c.id AS class_id, 
                c.name AS class_name, 
                c.class_datetime, 
                t.name AS trainer_name
            FROM bookings b
            JOIN classes c ON b.class_id = c.id
            JOIN trainers t ON c.trainer_id = t.id
            WHERE b.user_id = ? AND c.class_datetime >= NOW()
            ORDER BY c.class_datetime ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "bookings" => $bookings]);
} else {
    echo json_encode(["success" => false, "message" => "ID do utilizador em falta."]);
}
?>