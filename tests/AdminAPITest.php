<?php

/**
 * KROK 2: E2E Integračný Test pre Admin API
 * Spustenie: php tests/AdminAPITest.php
 */

// Jednoduchý autoloader pre potreby testu
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) require $file;
});

use App\Controllers\AdminController;

function runTest() {
    try {
        // 1. Setup: Pripojenie na SQLite a vymazanie tabuliek
        $dbPath = __DIR__ . '/../database.sqlite';
        if (!file_exists($dbPath)) {
            die("❌ CHYBA: Databáza neexistuje. Spusti najprv inicializáciu.\n");
        }
        
        $db = new PDO('sqlite:' . $dbPath);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $db->exec("DELETE FROM ai_escalations");
        $db->exec("DELETE FROM chat_history");

        // 2. Seed: Vloženie testovacích dát
        $sessionId = 'test_esc_123';
        
        // Chat história
        $stmtHist = $db->prepare("INSERT INTO chat_history (session_id, role, content) VALUES (?, ?, ?)");
        $stmtHist->execute([$sessionId, 'user', 'Mám problém']);
        $stmtHist->execute([$sessionId, 'ai', 'Zavolám človeka']);
        
        // Eskalácia
        $stmtEsc = $db->prepare("INSERT INTO ai_escalations (session_id, reason, customer_message, status) VALUES (?, ?, ?, ?)");
        $stmtEsc->execute([$sessionId, 'Testovacia eskalácia', 'Prosím o pomoc', 'pending']);

        // 3. Simulácia volania AdminController
        $controller = new AdminController($db);
        
        // Zachytenie výstupu
        ob_start();
        $controller->getEscalations();
        $output = ob_get_clean();

        // 4. Asserts (Overenie)
        
        // Overenie validného JSONu
        $data = json_decode($output, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Nevalidný JSON výstup: " . json_last_error_msg());
        }

        // Overenie počtu eskalácií
        if (count($data) !== 1) {
            throw new Exception("Očakávaný 1 záznam eskalácie, vrátených: " . count($data));
        }

        $escalation = $data[0];

        // Overenie kľúča history
        if (!isset($escalation['history'])) {
            throw new Exception("Eskalácii chýba kľúč 'history'");
        }

        // Overenie obsahu histórie (presne 2 správy)
        if (count($escalation['history']) !== 2) {
            throw new Exception("Očakávané 2 správy v histórii, vrátených: " . count($escalation['history']));
        }

        // Overenie správnosti poradia a obsahu
        if ($escalation['history'][0]['role'] !== 'user' || $escalation['history'][1]['role'] !== 'ai') {
            throw new Exception("Nesprávne poradie alebo role v histórii.");
        }

        // 5. Report
        echo "\033[32m✅ ADMIN API TEST ÚSPEŠNÝ\033[0m\n";
        
    } catch (Exception $e) {
        echo "\033[31m❌ TEST ZLYHAL: " . $e->getMessage() . "\033[0m\n";
        exit(1);
    }
}

runTest();
