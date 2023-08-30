const db = require("../config/db");

const readUser = (search, sort) => {
    return db.query(`
        SELECT * 
        FROM users 
        WHERE users.username LIKE '%${search}%'
        ORDER BY users.username ${sort}
    `);
};


const findById = (id) => {
    return db.query(`SELECT * FROM users WHERE users.id=${id}`);
};

const verifyUser = (id) => {
    return db.query(`UPDATE * FROM users SET verif=1 WHERE users.id=${id}`);
};


const createUser = (data) => {
    const { email, phone_number, username, password, role } = data;
    return new Promise((resolve, reject) =>
        db.query(`INSERT INTO users(email, username, password, phone_number,role) VALUES('${email}', '${username}', '${password}', '${phone_number}',${role})`, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err.message);
            }
        })
    );
};

const loginUser = (username) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM users WHERE username = '${username}'`,
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            },
        );
    });
};


const updateUser = (data, id) => {
    const { username, password, phone_number, image, role } = data;
    return db.query(`UPDATE users SET username='${username}', password='${password}', phone_number='${phone_number}',image='${image}',role = ${role} WHERE users.id = ${id}`);
};

const deleteUser = (id) => {
    return db.query(`DELETE FROM users WHERE users.id=${id}`);
};







module.exports = { readUser, findById, createUser, loginUser, updateUser, deleteUser, verifyUser };