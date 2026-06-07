<?php
// Configuração global de CORS para permitir pedidos do React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Definir o formato de saída global para JSON, evita avisos no lado do frontend
header('Content-Type: application/json; charset=utf-8');

// Interceptar pedidos OPTIONS (preflight) gerados pelo browser antes do POST
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "domus-fit"; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    // Ativar o disparo de exceções para apanhar erros de SQL no bloco try-catch
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro de BD: " . $e->getMessage()]);
    die();
}
?>