DROP TABLE IF EXISTS chat_messages;

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (message, sender_id) VALUES ('Hey there', 50);
