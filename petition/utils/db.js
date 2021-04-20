const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/petition`
);

///Maybe a different structure?
module.exports.addUser = (first, last, email, password_hash) => {
    const q = `INSERT INTO users (first, last, email, password_hash)
        VALUES ($1,$2,$3,$4)
        RETURNING id
        `;
    const params = [first, last, email, password_hash];
    return db.query(q, params);
};

module.exports.addProfile = (age, city, url, user_id) => {
    const q = `
        INSERT INTO user_profiles (age, city, url, user_id) 
        VALUES ($1, $2, $3, $4)
    `;
    const params = [age, city, url, user_id];
    return db.query(q, params);
};

module.exports.addSignature = (user_id, signature) => {
    const q = `
        INSERT INTO signatures (user_id, signature) 
        VALUES ($1, $2)
        RETURNING id
    `;
    const params = [user_id, signature];
    return db.query(q, params);
};

module.exports.getSigners = () => {
    const q = `
    SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url
    FROM users
    JOIN signatures
    ON users.id = signatures.user_id
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    `;
    return db.query(q);
};

module.exports.allSignersByCity = (city) => {
    const q = `
    SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url 
    FROM users
    JOIN signatures
    ON users.id = signatures.user_id
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE LOWER(user_profiles.city) = LOWER($1)
    `;
    const params = [city];
    return db.query(q, params);
};

module.exports.getNumSigners = () => {
    const q = `
            SELECT 
                COUNT (*)
            FROM
                signatures`;
    return db.query(q);
};

module.exports.getName = (id) => {
    const q = `
    SELECT first FROM users WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getProfile = (id) => {
    const q = `
        SELECT first, last, email, age, city, url 
        FROM users
        LEFT JOIN user_profiles
        ON user_profiles.user_id = users.id
        WHERE users.id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

exports.updateUserAndPassword = (first, last, email, password_hash, id) => {
    const q = `
        UPDATE users 
        SET (first, last, email, password_hash) = ($1, $2, $3, $4)
        WHERE id = $5
    `;
    const params = [first, last, email, password_hash, id];
    return db.query(q, params);
};

exports.updateUser = (first, last, email, id) => {
    const q = `
        UPDATE users 
        SET (first, last, email) = ($1, $2, $3)
        WHERE id = $4
    `;
    const params = [first, last, email, id];
    return db.query(q, params);
};

exports.upsertUserProfile = (age, city, url, id) => {
    const q = `
        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age=$1, city=$2, url=$3
    `;
    const params = [age, city, url, id];
    return db.query(q, params);
};

module.exports.getUser = (email) => {
    const q = `
    SELECT users.id, users.password_hash, signatures.id AS signature_id, signatures.signature 
    FROM users
    LEFT JOIN signatures
    ON users.id = signatures.user_id 
    WHERE email = $1
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.getSignature = (id) => {
    const q = `SELECT signature FROM signatures WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteSignature = (id) => {
    const q = `DELETE FROM signatures WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteProfile = (id) => {
    const q = `DELETE FROM user_profiles WHERE user_id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteUser = (id) => {
    const q = `DELETE FROM users WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};

// module.exports.capitalCities = (city) => {
//     const q = `SELECT UPPER(city) FROM user_profiles`;
//     const params = [city];
//     return db.query(q, params);
// };
