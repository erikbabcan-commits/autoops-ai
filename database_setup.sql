-- Schema pre GrowMedica Autonómny AI Agent v2.0

-- 1. Tabuľka produktov (Existujúca, len pre AI čítanie)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    stock INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabuľka pre históriu chatu (Kontext/Pamäť)
CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(128) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'user', 'ai', alebo 'operator'
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);

-- 3. Tabuľka pre Eskalácie (Human-in-the-Loop)
CREATE TABLE IF NOT EXISTS ai_escalations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(128) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    customer_message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'resolved'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabuľka pre Rate Limiting (Ochrana API)
CREATE TABLE IF NOT EXISTS rate_limits (
    ip_address VARCHAR(45) PRIMARY KEY,
    requests_count INT DEFAULT 1,
    last_request_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Voliteľné: Demo dáta
INSERT INTO products (name, description, price, stock) VALUES 
('Magnézium Chelát', 'Vysoko vstrebateľná forma horčíka pre lepší spánok a regeneráciu.', 14.90, 50),
('Vitamín C 1000mg', 'Podpora imunity s postupným uvoľňovaním.', 9.50, 120),
('Ashwagandha KSM-66', 'Adaptogén na zvládanie stresu a úzkosti.', 19.90, 35);
