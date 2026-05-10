<?php
// 1. Damos permissão a qualquer browser para falar connosco
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// 2. Respondemos ao tal "pedido fantasma" (OPTIONS) com um OK (200) e paramos por aqui!
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. A tua ligação à Base de Dados
$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "domus-fit"; // <-- O nome que descobriste que estava certo!

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro de BD: " . $e->getMessage()]);
    die();
}
?>