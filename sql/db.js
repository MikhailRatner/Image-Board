const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

module.exports.getAllImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC LIMIT 3;`;
    return db.query(q);
};

module.exports.getMoreImages = (smallestId) => {
    const q = ` SELECT url, title, id, (
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1
                ) AS "smallestId" FROM images
                WHERE id < $1
                ORDER BY id DESC
                LIMIT 3;`;
    const params = [smallestId];
    return db.query(q, params);
};

module.exports.imageToDatabase = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description)
    VALUES ($1,$2,$3,$4)`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getImageById = (id) => {
    const q = `SELECT * FROM images WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addCommentToImg = (text, username, comment_id) => {
    const q = `INSERT INTO comments (text, username, comment_id)
    VALUES ($1, $2, $3) RETURNING *`;
    const params = [text, username, comment_id];
    return db.query(q, params);
};

module.exports.getAllCommentsByImgId = (imageId) => {
    const q = `SELECT * FROM comments WHERE comment_id=$1`;
    const params = [imageId];
    return db.query(q, params);
};
