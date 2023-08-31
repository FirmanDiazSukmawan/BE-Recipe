const { readUser, createUser, updateUser, deleteUser, findById, loginUser } = require("../model/userModel");
const { generateToken } = require("../helper/jwt");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinaryConfig");
// const redis = require("../config/redisConfig");

const userController = {
    getUser: async (req, res) => {
        let search = req.query.search || "";
        let sort = req.query.sort || "ASC";
        try {
            let result = await readUser(search, sort);
            res.status(200).json({
                message: "user has been read successfully",
                data: result.rows
            });
        } catch (err) {
            res.status(400).json({
                error: err.message,
                message: "error reading user ",
            });
        }
    },

    getUserById: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await findById(id);
            // const dataRedis = redis.set(`getFromRedis/${id}`, JSON.stringify(result), { EX: 180, NX: true });
            res.json({
                // fromCache: false,
                // data: dataRedis
                data: result.rows[0],
                message: "get data successfully"
            });
        }
        catch (err) {
            res.json({
                error: err.message,
                message: "error getting user"
            });
        }
    },

    // versi then catch redis 
    // getUserById: (req, res) => {
    //     const id = req.params.id;
    //     findById(id)
    //         .then((result) => {
    //             const dataRedis = redis.set(`getFromRedis/${id}`, JSON.stringify(result), {
    //                 EX: 180,
    //                 NX: true,
    //             });
    //             res.send({
    //                 fromCache: false,
    //                 data: dataRedis
    //             });
    //         })
    //         .catch((err) => {
    //             res.json({ message: err.message });
    //         });
    // },

    createUser: async (req, res) => {
        try {
            const { email, username, password, phone_number, role } = req.body;

            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error hashing password",
                        error: err.message,
                    });
                }

                const user = {
                    email,
                    username,
                    password: hash,
                    phone_number,
                    role
                };
                // console.log(user);

                try {
                    const userData = await createUser(user);

                    res.json({
                        message: "User has been created successfully",
                        data: userData,
                    });
                } catch (err) {
                    res.json({
                        message: "Error creating user",
                        err: err.message,
                    });
                }
            });
        } catch (err) {
            res.json({
                message: "Error creating user Catch",
                err: err.message,
            });
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const result = await loginUser(username);


            if (result.rowCount > 0) {
                const passwordHash = result.rows[0].password;
                const PasswordValid = await bcrypt.compare(password, passwordHash);
                const userRole = result.rows[0].role;
                // console.log(userRole);



                if (PasswordValid) {
                    const token = await generateToken({
                        role: userRole
                    });

                    const data = {
                        message: "Login successful",
                        token: token,
                        user: username
                    };

                    res.json(data);
                } else {
                    res.json({ message: "Invalid username or password" });
                }
            } else {
                res.json({ message: "Invalid username or password" });
            }
        } catch (error) {
            res.json({ error, message: "An error occurred during login" });
        }
    },

    // <<<<<<<<<<<VERSI THEN CATCH>>>>>>>>>>>>


    // login: (req, res) => {
    //     const { username, password } = req.body;
    //     loginUser(username)
    //         .then((data) => {
    //             const userRole = data.rows[0].role;
    //             const userPassword = data.rows[0].password;
    //             if (data.rowCount > 0) {
    //                 bcrypt.compare(password, userPassword)
    //                     .then(async (result) => {
    //                         console.log(result);
    //                         if (result) {
    //                             const token = await generateToken({
    //                                 role: userRole
    //                             });
    //                             res.json({
    //                                 message: "LOGIN BERHASIL",
    //                                 generateToken: token
    //                             });
    //                         }
    //                         else {
    //                             res.json({
    //                                 message: "LOGIN GAGAL",
    //                             });
    //                         }
    //                     });
    //             }
    //         });
    // },




    updateDataUser: async (req, res) => {


        try {
            const { id } = req.params;
            // console.log(req);
            const userImage = await cloudinary.uploader.upload(req.file.path, { folder: "users" });
            const result = await findById(Number(id));
            const user = result.rows[0];
            const data = {
                username: req.body.username ?? user.username,
                password: req.body.password ?? user.password,
                phone_number: req.body.phone_number ?? user.phone_number,
                image: userImage.secure_url ?? null,
                role: req.body.role ?? user.role
            };



            await updateUser(data, Number(id));

            res.status(200).json({
                message: "Update Successfull",

            });
        } catch (error) {
            res.status(400).json({
                message: "Update Error",
                error: error.message
            });
        }
    },


    deleteDataUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const result = await deleteUser(userId);

            res.json({
                message: "delete data sucessfully",
                data: `id ${result} has been deleted`
            });
        }
        catch (err) {
            res.json({
                error: err.message,
                message: "error deleting data"
            });
        }
    }
};

module.exports = userController;