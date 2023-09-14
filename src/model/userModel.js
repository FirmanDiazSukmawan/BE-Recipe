const db = require("../config/db");

const readUser = (search, sort) => {
    return db.query(`
        SELECT * 
        FROM users 
        WHERE users.username LIKE '%${search}%'
        ORDER BY users.username ${sort}
    `);
};

const selectPagination = () => {
    return db.query("SELECT COUNT(*) AS total FROM users");
};

const pagination = (limit, offset) => {
    return db.query(`SELECT *FROM users LIMIT ${limit} OFFSET ${offset}`);
};


const findById = (users_id) => {
    return db.query(`SELECT * FROM users WHERE users.users_id=${users_id}`);
};

const findUserEmail = (email) => {
    return new Promise((resolve, reject) =>
        db.query(`SELECT * FROM users WHERE users.email = '${email}'`,
            (err, res) => {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err.message);
                }
            })
    );
};

const verifyUser = (users_id) => {
    return db.query(`UPDATE * FROM users SET verif=1 WHERE users.users_id=${users_id}`);
};

const createUser = (data) => {
    const { email, phone_number, username, password, role } = data;
    return new Promise((resolve, reject) =>
        db.query(`INSERT INTO users(email,phone_number,username, password,role) VALUES('${email}','${phone_number}', '${username}', '${password}', ${role})`, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err.message);
            }
        })
    );
};

const loginUser = (email) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM users WHERE email = '${email}'`,
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            },
        );
    });
};


const updateUser = (data, users_id) => {
    const { username, phone_number, image } = data;
    return db.query(`UPDATE users SET username='${username}', phone_number='${phone_number}',image='${image}' WHERE users.users_id = ${users_id}`);
};

const deleteUser = (users_id) => {
    return db.query(`DELETE FROM users WHERE users.users_id=${users_id}`);
};






module.exports = { readUser, findById, createUser, loginUser, updateUser, deleteUser, verifyUser, selectPagination, pagination,findUserEmail};