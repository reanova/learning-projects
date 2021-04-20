DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships ( 
    id SERIAL PRIMARY KEY, 
    sender_id INT REFERENCES users(id) NOT NULL, 
    receiver_id INT REFERENCES users(id) NOT NULL, 
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);