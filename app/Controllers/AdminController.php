<?php

namespace App\Controllers;

use PDO;
use PDOException;
use Exception;

class AdminController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * KROK 1: Metóda getEscalations() pre REST API
     */
    public function getEscalations(): void
    {
        // 1. Odoslanie HTTP hlavičiek (JSON + CORS)
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        try {
            // 2. Získanie pending eskalácií zoradených podľa času (najnovšie hore)
            $stmt = $this->db->query("SELECT * FROM ai_escalations WHERE status = 'pending' ORDER BY created_at DESC");
            $escalations = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $result = [];

            foreach ($escalations as $esc) {
                // 3. Kontext (History Mapping): Posledných 6 správ zoradených chronologicky ASC
                // Najprv vytiahneme posledných 6 (DESC) a potom ich otočíme
                $stmtCtx = $this->db->prepare("
                    SELECT role, content, created_at 
                    FROM chat_history 
                    WHERE session_id = ? 
                    ORDER BY id DESC 
                    LIMIT 6
                ");
                $stmtCtx->execute([$esc['session_id']]);
                $history = array_reverse($stmtCtx->fetchAll(PDO::FETCH_ASSOC));

                // 4. Priradenie dát
                $esc['history'] = $history ?: [];
                $result[] = $esc;
            }

            // 5. Návrat JSON (kód 200 je default)
            echo json_encode($result);

        } catch (PDOException $e) {
            // 6. Ošetrenie chýb databázy (kód 500)
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
        }
    }

    /**
     * Ponechávame resolveEscalation pre budúce použitie, hoci v tomto kroku nie je prioritou.
     */
    public function resolveEscalation(): void
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $escalationId = $input['escalation_id'] ?? null;
            $operatorReply = $input['operator_reply'] ?? '';

            if (!$escalationId || empty($operatorReply)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing escalation_id or operator_reply']);
                return;
            }

            $stmt = $this->db->prepare("SELECT session_id FROM ai_escalations WHERE id = ?");
            $stmt->execute([$escalationId]);
            $esc = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$esc) {
                http_response_code(404);
                echo json_encode(['error' => 'Escalation not found']);
                return;
            }

            $this->db->beginTransaction();

            $stmtUpd = $this->db->prepare("UPDATE ai_escalations SET status = 'resolved' WHERE id = ?");
            $stmtUpd->execute([$escalationId]);

            $stmtHist = $this->db->prepare("INSERT INTO chat_history (session_id, role, content) VALUES (?, 'operator', ?)");
            $stmtHist->execute([$esc['session_id'], $operatorReply]);

            $this->db->commit();

            echo json_encode(['status' => 'success']);

        } catch (Exception $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
