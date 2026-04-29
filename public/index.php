<?php

/**
 * GrowMedica AI Agent - API Entry Point
 */

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ChatController;
use App\Controllers\AdminController;

// CORS preflight handling
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Načítanie .env
if (file_exists(__DIR__ . '/../.env.local')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..', '.env.local');
} else {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
}
$dotenv->safeLoad();

// DB inicializácia
try {
    $dbPath = __DIR__ . '/../database.sqlite';
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'chat':
        $controller = new ChatController($db);
        $controller->handleRequest();
        break;

    case 'admin/escalations':
        $controller = new AdminController($db);
        $controller->getEscalations();
        break;

    case 'admin/resolve':
        $controller = new AdminController($db);
        $controller->resolveEscalation();
        break;

    default:
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found: ' . $action]);
        break;
}
