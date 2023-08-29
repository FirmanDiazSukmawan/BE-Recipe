require("dotenv").config();
const pg = require("pg");
const db = new pg.Pool({


    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DB,
    user: process.env.USER,
    password: process.env.PASSWORD







});

db.connect((err) => {
    if (err) {
        console.log(err);
    }
});

module.exports = db;