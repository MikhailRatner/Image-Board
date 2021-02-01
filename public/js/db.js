const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

module.exports.getAllImages = () => {
    const q = `SELECT * FROM images`;
    return db.query(q);
};
