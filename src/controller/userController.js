const { readUser, createUser, updateUser, deleteUser, findById, loginUser } = require("../model/userModel");
const { generateToken } = require("../helper/jwt");
const bcrypt = require("bcrypt");

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
            res.json(result.rows);
        }
        catch (err) {
            res.json({
                error: err.message,
                message: "error getting user"
            });
        }
    },

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
                // console.log (user);

                try {
                    const userData = await createUser(user);

                    res.status(201).json({
                        message: "User has been created successfully",
                        data: userData,
                    });
                } catch (err) {
                    res.status(500).json({
                        message: "Error creating user",
                        error: err.message,
                    });
                }
            });
        } catch (err) {
            res.status(400).json({
                message: "Error creating user",
                error: err.message,
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
                console.log(userRole);



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

    // login: async (req, res) => {
    //     const { username, password } = req.body;
    //     loginUser(username)
    //         .then(async (hasil) => {
    //             const userPassword = hasil.rows[0].password;
    //             console.log(userPassword);
    //             if (hasil.rowCount > 0) {
    //                 const hasilPassword = await bcrypt.compare(password, userPassword);
    //                 if (hasilPassword) {
    //                     const token = await generateToken({
    //                         username: hasil.rows[0].username
    //                     });
    //                     res.json({
    //                         message: "login succes",
    //                         generateToken: token,
    //                         user: username

    //                     });
    //                 } else {
    //                     res.json({
    //                         message: "Login failed",
    //                     });
    //                 }

    //             }
    //         })
    //         .catch((err) => {
    //             res.json({
    //                 message: "Data Blank",
    //                 error: err.message
    //             });
    //         });
    // },


    updateDataUser: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await findById(Number(id));
            const user = result.rows[0];

            const data = {
                username: req.body.username || user.username,
                password: req.body.password || user.password,
                phone_number: req.body.phone_number || user.phone_numer,
                profile_picture: req.file.filename || user.profile_picture,
                role: req.body.role || user.role
            };

            await updateUser(data, Number(id));

            res.status(200).json({
                message: "Update Successfull",

            });
        } catch (error) {
            res.status(400).json({
                message: "Update Error",
                error: error
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