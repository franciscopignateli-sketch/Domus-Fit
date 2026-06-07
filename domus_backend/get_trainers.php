<?php
require 'db.php';

try {
    $stmt = $pdo->query("SELECT id, name, specialty FROM trainers ORDER BY name ASC");
    $trainers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "trainers" => $trainers]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro na base de dados: " . $e->getMessage()]);
}
?>