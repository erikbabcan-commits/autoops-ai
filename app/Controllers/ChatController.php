<?php

namespace App\Controllers;

use PDO;
use Exception;
use App\Tools\ProductDatabaseTool;
use NeuronAI\Agent\Agent;
use NeuronAI\Providers\Mistral\Mistral; // Predpokladáme Mistral podľa blueprintu
use NeuronAI\Agent\SystemPrompt;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Chat\Messages\AIMessage;
use NeuronAI\Chat\History\MemoryHistory;

class ChatController
{
    private PDO $db;
    private string $mistralKey;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->mistralKey = $_ENV['MISTRAL_API_KEY'] ?? '';
    }

    /**
     * Hlavný orchestrátor spracovania chatu (B. Hlavný Controller)
     * Implementuje všetkých 7 bodov toku spracovania.
     */
    public function handleRequest(): void
    {
        header('Content-Type: application/json');

        try {
            // 1. Prijatie dát a Session
            $input = json_decode(file_get_contents('php://input'), true);
            $userMessageText = $input['message'] ?? '';

            if (empty($userMessageText)) {
                echo json_encode(['status' => 'error', 'message' => 'No message provided']);
                return;
            }

            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            $sessionId = session_id();
            $gdprConsent = $_SESSION['gdpr_consent_given'] ?? false;

            // 2. Rate Limiting (Bezpečnostná ochrana)
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $this->checkRateLimit($ipAddress);

            // 3. Načítanie Pamäte (Context Memory)
            $history = $this->loadChatHistory($sessionId, 6);

            // 4. Inicializácia AI a Nástrojov
            $provider = new Mistral(key: $this->mistralKey, model: 'mistral-large-latest');
            
            // Inicializujeme tool a agenta
            $productTool = new ProductDatabaseTool($this->db);
            
            // Definujeme agenta lokálne alebo cez triedu (tu pre ukážku inline konfigurácia)
            $agent = new class($provider) extends Agent {
                public function setInstructions(string $instructions): void {
                    $this->instructions = $instructions;
                }
                
                public function addCustomTool($tool): void {
                    $this->tools[] = $tool;
                }

                protected function provider(): \NeuronAI\Providers\AIProviderInterface {
                    return $this->provider;
                }

                protected function instructions(): string {
                    return $this->instructions ?? 'Si asistent e-shopu GrowMedica.';
                }
            };

            // Registrácia nástrojov z ProductDatabaseTool
            // POZOR: escalateToHuman vyžaduje vstreknuté sessionId
            $agent->addCustomTool($productTool->getSearchTool());
            $agent->addCustomTool($productTool->getStockTool());
            $agent->addCustomTool($productTool->getEscalationTool($sessionId)); // Vstreknutie sessionId

            // 5. Dynamický System Prompt (GDPR Štít)
            $basePrompt = "Si inteligentný asistent e-shopu GrowMedica. Pomáhaš zákazníkom s výberom produktov a informáciami o objednávkach.";
            if (!$gdprConsent) {
                $basePrompt .= "\n\nCRITICAL GDPR RULE: Používateľ neudelil súhlas so spracovaním zdravotných údajov. " .
                               "Prísne sa zakazuje pýtať sa na osobné zdravotné údaje, anamnézu alebo diagnostikovať zdravotný stav.";
            }
            $agent->setInstructions($basePrompt);

            // 6. Samotná Exekúcia a Fallback (Try/Catch)
            try {
                // Odovzdáme históriu do agenta (v Neuron AI sa to zvyčajne robí cez Memory)
                foreach ($history as $msg) {
                    $agent->addMessage($msg);
                }

                $response = $agent->chat(new UserMessage($userMessageText));
                $aiReply = $response->getContent();

            } catch (Exception $e) {
                // Zalogujeme technickú chybu na serveri
                error_log("AI Execution Error: " . $e->getMessage());
                
                // Fallback správa pre užívateľa
                $aiReply = "Ospravedlňujeme sa, ale moje systémy sú dočasne preťažené. Skúste to prosím neskôr.";
            }

            // 7. Zápis do Histórie a Návrat Odpovede
            $this->saveToHistory($sessionId, 'user', $userMessageText);
            $this->saveToHistory($sessionId, 'ai', $aiReply);

            echo json_encode([
                'reply' => $aiReply,
                'status' => 'success'
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Internal Server Error'
            ]);
        }
    }

    private function checkRateLimit(string $ip): void
    {
        $limit = 10; // Max 10 požiadaviek za minútu
        $stmt = $this->db->prepare("SELECT requests_count, last_request_time FROM rate_limits WHERE ip_address = ?");
        $stmt->execute([$ip]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $now = date('Y-m-d H:i:s');

        if ($row) {
            $lastRequest = strtotime($row['last_request_time']);
            if (time() - $lastRequest < 60) {
                if ($row['requests_count'] >= $limit) {
                    http_response_code(429);
                    echo json_encode(['status' => 'error', 'message' => 'Too many requests. Please wait a minute.']);
                    exit;
                }
                $stmt = $this->db->prepare("UPDATE rate_limits SET requests_count = requests_count + 1, last_request_time = ? WHERE ip_address = ?");
                $stmt->execute([$now, $ip]);
            } else {
                $stmt = $this->db->prepare("UPDATE rate_limits SET requests_count = 1, last_request_time = ? WHERE ip_address = ?");
                $stmt->execute([$now, $ip]);
            }
        } else {
            $stmt = $this->db->prepare("INSERT INTO rate_limits (ip_address, requests_count, last_request_time) VALUES (?, 1, ?)");
            $stmt->execute([$ip, $now]);
        }
    }

    private function loadChatHistory(string $sessionId, int $limit): array
    {
        $stmt = $this->db->prepare("SELECT role, content FROM chat_history WHERE session_id = ? ORDER BY created_at DESC LIMIT ?");
        $stmt->bindValue(1, $sessionId);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        $rows = array_reverse($stmt->fetchAll(PDO::FETCH_ASSOC));
        $messages = [];

        foreach ($rows as $row) {
            if ($row['role'] === 'user') {
                $messages[] = new UserMessage($row['content']);
            } elseif ($row['role'] === 'ai') {
                $messages[] = new AIMessage($row['content']);
            }
        }

        return $messages;
    }

    private function saveToHistory(string $sessionId, string $role, string $content): void
    {
        $stmt = $this->db->prepare("INSERT INTO chat_history (session_id, role, content) VALUES (?, ?, ?)");
        $stmt->execute([$sessionId, $role, $content]);
    }
}
