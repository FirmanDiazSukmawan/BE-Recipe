const {
  readUser,
  createUser,
  updateUser,
  deleteUser,
  findById,
  loginUser,
  selectPagination,
  pagination,
  findUserEmail,
  logoutUser
} = require("../model/userModel");
// const { findUserEmail, findUserById, findRecipeById } = require("../middleware/verifyRole");
const { generateToken, refreshToken } = require("../helper/jwt");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinaryConfig");
const redis = require("../config/redisConfig");

const userController = {
  getUser: async (req, res) => {
    let search = req.query.search || "";
    let sort = req.query.sort || "ASC";
    try {
      let result = await readUser(search, sort);
      res.status(200).json({
        message: "user has been read successfully",
        data: result.rows,
      });
    } catch (err) {
      res.status(400).json({
        error: err.message,
        message: "error reading user ",
      });
    }
  },

  selectPage: async (req, res) => {
    let { limit, page } = req.query;
    let pageValue = page ? Number(page) : 1;
    let limitValue = limit ? Number(limit) : 2;
    const offsetValue = pageValue === 1 ? 0 : (pageValue - 1) * limitValue;
    const allData = await selectPagination();
    const totalData = Number(allData.rows[0].total);

    try {
      let result = await pagination(limitValue, offsetValue);
      res.status(200).json({
        message: "user has been selected by limit and offset",
        currentPage: pageValue,
        dataPerPage: limitValue,
        totalPage: Math.ceil(totalData / limitValue),
        totalData,
        data: result.rows,
      });
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  },

  getUserByIdRedis: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await findById(id);
      const dataRedis = redis.set(
        `getFromRedis/${id}`,
        JSON.stringify(result),
        { EX: 180, NX: true }
      );
      res.json({
        fromCache: false,
        data: dataRedis,
        // data: result.rows[0],
        // message: "get data successfully"
      });
    } catch (err) {
      res.json({
        error: err.message,
        message: "error getting user",
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const users_id = req.params.users_id;
      const result = await findById(users_id);
      res.json({
        data: result.rows[0],
        message: "get data successfully"
      });
    } catch (err) {
      res.json({
        error: err.message,
        message: "error getting user",
      });
    }
  },

  getUserByPayload: async(req,res) => {
    try{
      const users_id = req.payload.users_id;
      const result = await findById(users_id);
      res.status(200).json(
        {
          message:"user",
          data:result.rows
        });
    } catch(err) {
      res.status(400).json ({
        message: "user not found"
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
      const { email, username, password,confirmPassword, phone_number, role } = req.body;

     let {rowCount} = await findUserEmail(email);
     if (rowCount) {
        return res.status(400).json ({ message:"email already in use,please use another email"});
     }
     if (password !== confirmPassword) return res.status(401).json({ message:"passsword and confirm password do not match"});
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
          role,
        };
        // console.log(user);

        try {
          const userData = await createUser(user);
          // console.log("User data:", userData);
          res.status(200).json({
            message: "User has been created successfully",
            data: userData,
          });
        } catch (err) {
          console.error("Error creating user:", err);
          res.status(400).json({
            message: "Error creating user",
            err: err.message,
          });
        }
      });
    } catch (err) {
      res.status(400).json({
        message: "Error creating user Catch",
        err: err.message,
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await loginUser(email);
    //   console.log(result.rows);

      if (result.rowCount > 0) {
        const passwordHash = result.rows[0].password;
        const PasswordValid = await bcrypt.compare(password, passwordHash);
        const userRole = result.rows[0].role;

        // console.log(result);

        if (PasswordValid) {
          const token = await generateToken({
            role: userRole,
          });

          return res.status(200).json({
            message: "Login successful",
            token: token,
            data:result.rows[0]
                });
        } else {
          res.status(400).json({ message: "Invalid email or password" });
        }
      } else {
        res.status(400).json({ message: "Invalid email or password " });
      }
    } catch (error) {
      res
        .status(400)
        .json({ error, message: "An error occurred during login" });
    }
  },
  

  // <<<<<<<<<<<VERSI THEN CATCH>>>>>>>>>>>>

  // login: (req, res) => {
  //     const { username, password } = req.body;
  //     loginUser(username)
  //         .then((data) => {
  //             console.log(data);
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
      const  users_id  = req.params.users_id;
      // console.log(req);
      const userImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "user",
      });
      const result = await findById(Number(users_id));
      const user = result.rows[0];
      const data = {
        username: req.body.username ?? user.username,
        password: req.body.password ?? user.password,
        phone_number: req.body.phone_number ?? user.phone_number,
        image: userImage.secure_url ?? null,
        role: req.body.role ?? user.role,
      };

      await updateUser(data, Number(users_id));

      res.status(200).json({
        message: "Update Successfull",
      });
    } catch (error) {
      res.status(400).json({
        message: "Update Error",
        error: error.message,
      });
    }
  },

  deleteDataUser: async (req, res) => {
    try {
      const users_id = req.params.users_id;
      const result = await deleteUser(users_id);
      const data = await cloudinary.uploader.destroy(result);
      res.json({
        message: "delete data sucessfully",
        data: `id ${data} has been deleted`,
      });
    } catch (err) {
      res.json({
        error: err.message,
        message: "error deleting data",
      });
    }
  },
};

module.exports = userController;
