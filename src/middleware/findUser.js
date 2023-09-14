// const db = require("../config/db");



// const findUserById = (id) => {
//     return new Promise((resolve, reject) =>
//         db.query(`SELECT * FROM users WHERE users.id = '${id}'`,
//             (err, res) => {
//                 if (!err) {
//                     resolve(res);
//                 } else {
//                     reject(err.message);
//                 }
//             })
//     );
// };

// const findRecipeById = (id) => {
//     return new Promise((resolve, reject) =>
//         db.query(`SELECT * FROM food_recipe WHERE foodrecipe.id = '${id}'`,
//             (err, res) => {
//                 if (!err) {
//                     resolve(res);
//                 } else {
//                     reject(err.message);
//                 }
//             })
//     );
// };

// module.exports = { findUserEmail, findUserById, findRecipeById };