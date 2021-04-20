const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/fennelsocialnetwork`
);

module.exports.addUser = (first, last, email, password_hash) => {
    const q = `
        INSERT INTO users (first, last, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const params = [first, last, email, password_hash];
    return db.query(q, params);
};

module.exports.getUser = (email) => {
    const q = `
    SELECT * FROM users
    WHERE email = $1
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserById = (id) => {
    const q = `
        SELECT first,last,image_url, bio FROM users
        WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addCode = (email, code) => {
    const q = `
        INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.getCode = (email) => {
    const q = `
        SELECT * FROM reset_codes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePassword = (email, new_password_hash) => {
    const q = `
        UPDATE users
        SET password_hash = $2
        WHERE email = $1
    `;
    const params = [email, new_password_hash];
    return db.query(q, params);
};

module.exports.addImage = (image_url, id) => {
    const q = `
    UPDATE users
    SET image_url = $1
    WHERE id = $2   
    `;
    const params = [image_url, id];
    return db.query(q, params);
};

module.exports.addBio = (bio, id) => {
    const q = `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    RETURNING bio
    `;
    const params = [bio, id];
    return db.query(q, params);
};

module.exports.findnewUsers = () => {
    const q = `SELECT * FROM users
        ORDER BY id DESC
        LIMIT 5;
        `;
    return db.query(q);
};

module.exports.findreqUsers = (val) => {
    return db.query(
        `SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1;`,
        [val + "%"]
    );
};

module.exports.getFriendshipStatus = (userId, otherId) => {
    const q = `
        SELECT * FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.startFriendship = (userId, otherId) => {
    const q = `
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.acceptFriendship = (userId, otherId) => {
    const q = `
        UPDATE friendships
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.endFriendship = (userId, otherId) => {
    const q = `
        DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.getConnectionsWannabes = (userId) => {
    const q = `
        SELECT users.id, first, last, image_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
    `;
    const params = [userId];
    return db.query(q, params);
};

module.exports.getMessages = () => {
    const q = `
        SELECT chat_messages.id, message, sent_at, sender_id, users.first, users.last, users.image_url
        FROM chat_messages
        JOIN users
        ON (sender_id = users.id)
        ORDER BY sent_at DESC
    `;
    return db.query(q);
};

module.exports.addMessage = (senderId, message) => {
    const q = `
        INSERT INTO chat_messages (sender_id, message)
        VALUES ($1, $2)
        RETURNING id, sent_at
    `;
    const params = [senderId, message];
    return db.query(q, params);
};

module.exports.getOnlineUsers = (arrayOfIds) => {
    const query =
        "SELECT id, first, last, image_url FROM users WHERE id = ANY($1)";
    const params = [arrayOfIds];
    return db.query(query, params);
};

module.exports.getWallPosts = (id) => {
    return db.query(
        `SELECT posts.id AS id, posts.created_at AS created_at, posts.image_id AS image_id, poster_id, text, first, last 
        FROM posts 
        JOIN users 
        ON (receiver_id = $1 AND poster_id = users.id) 
        ORDER BY id DESC;`,
        [id]
    );
};

module.exports.addWallPost = (text, poster_id, receiver_id) => {
    return db.query(
        `INSERT INTO posts (text, poster_id, receiver_id) 
        VALUES ($1, $2, $3) RETURNING *;`,
        [text, poster_id, receiver_id]
    );
};

module.exports.addWallImage = (poster_id, receiver_id, image_id) => {
    return db.query(
        `INSERT INTO posts (poster_id, receiver_id, image_id) 
        VALUES ($1, $2, $3) RETURNING *;`,
        [poster_id, receiver_id, image_id]
    );
};
