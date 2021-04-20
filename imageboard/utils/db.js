const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getAllImages = () => {
    const q = `
    SELECT * FROM images ORDER BY created_at DESC
    LIMIT 9
    `;
    return db.query(q);
};

module.exports.getMoreImages = (id) => {
    const q = `
        SELECT url, username, title, created_at, id, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 9;
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addImage = (url, username, title, description) => {
    const q = `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getImageById = (id) => {
    const q = `
        SELECT *
        FROM (
            SELECT url, username, title, description, created_at, id,
                LAG(id) OVER (ORDER BY id) AS "prev_id",
                LEAD(id) OVER (ORDER BY id) AS "next_id"
            FROM images
        ) AS "nav_table"
        WHERE id=$1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addComment = (text, username, imageId) => {
    const q = `
        INSERT INTO comments (text, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const params = [text, username, imageId];
    return db.query(q, params);
};

module.exports.getCommentsByImageId = (imageId) => {
    const q = `
        SELECT * FROM comments
        WHERE image_id=$1
        ORDER BY id DESC
    `;
    const params = [imageId];
    return db.query(q, params);
};

//new
