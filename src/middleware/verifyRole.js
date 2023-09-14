require("dotenv").config();
const jwt = require("jsonwebtoken");
const dataToken = process.env.SECRET_KEY;

module.exports = (req, res, next) => {

//     try {

//         const { token } = req.headers;
//         const decode = jwt.verify(token, dataToken);

//         req.APP_DATA = {
//             tokenDecode: decode
//         };
//         // console.log(req.APP_DATA);
//         next();
//     }

//     catch (err) {
//         res.json({
//             error: err.message
//         });
//     }
// };
    try {
        const authToken = req.headers.authorization;

        if (!authToken || !authToken.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token tidak ada" });
        }

        const token = authToken.split(" ")[1]; // Mengambil token dari header
        const decode = jwt.verify(token, dataToken);

        req.payload = decode;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token tidak valid" });
    }
};
