<?php

namespace App\Tools;

use PDO;
use NeuronAI\Tools\Tool;
use NeuronAI\Tools\ToolProperty;

class ProductDatabaseTool
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Nástroj na vyhľadávanie produktov
     */
    public function getSearchTool(): Tool
    {
        return Tool::make(
            name: 'searchProduct',
            description: 'Vyhľadá produkty v databáze GrowMedica podľa názvu alebo popisu.'
        )
        ->addProperty(new ToolProperty(
            name: 'query',
            type: 'string',
            description: 'Kľúčové slovo pre vyhľadávanie (napr. názov bylinky alebo symptóm).',
            required: true
        ))
        ->setCallable(function (string $query) {
            $stmt = $this->db->prepare("SELECT id, name, description, price, stock FROM products WHERE name LIKE ? OR description LIKE ?");
            $searchTerm = "%$query%";
            $stmt->execute([$searchTerm, $searchTerm]);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode($results ?: ['message' => 'Žiadne produkty sa nenašli.']);
        });
    }

    /**
     * Nástroj na kontrolu skladu
     */
    public function getStockTool(): Tool
    {
        return Tool::make(
            name: 'checkProductStock',
            description: 'Vráti aktuálny stav zásob a cenu pre konkrétne ID produktu.'
        )
        ->addProperty(new ToolProperty(
            name: 'productId',
            type: 'integer',
            description: 'ID produktu z databázy.',
            required: true
        ))
        ->setCallable(function (int $productId) {
            $stmt = $this->db->prepare("SELECT name, price, stock FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return json_encode($result ?: ['message' => 'Produkt s týmto ID neexistuje.']);
        });
    }

    /**
     * Nástroj na eskaláciu (Human-in-the-Loop)
     * sessionId je vstreknuté z controllera, AI ho nesmie meniť.
     */
    public function getEscalationTool(string $sessionId): Tool
    {
        return Tool::make(
            name: 'escalateToHuman',
            description: 'Eskaluje požiadavku na ľudského operátora, ak AI nevie pomôcť alebo ide o reklamáciu/refund.'
        )
        ->addProperty(new ToolProperty(
            name: 'reason',
            type: 'string',
            description: 'Dôvod eskalácie (napr. refund_request, complex_medical_question).',
            required: true
        ))
        ->addProperty(new ToolProperty(
            name: 'customerMessage',
            type: 'string',
            description: 'Pôvodná správa od zákazníka pre operátora.',
            required: true
        ))
        ->setCallable(function (string $reason, string $customerMessage) use ($sessionId) {
            $stmt = $this->db->prepare("INSERT INTO ai_escalations (session_id, reason, customer_message) VALUES (?, ?, ?)");
            $stmt->execute([$sessionId, $reason, $customerMessage]);

            return json_encode([
                'status' => 'success',
                'message' => 'Požiadavka bola úspešne eskalovaná na operátora.'
            ]);
        });
    }
}
