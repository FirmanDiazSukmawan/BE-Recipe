const express = require("express");
const router = express.Router();
const { getUser, getUserById, updateDataUser, deleteDataUser, createUser, login } = require("../controller/userController");
const upload = require("../middleware/multer");
const { isAdmin, isCustomer } = require("../middleware/auth");
const auth = require("../middleware/verifyRole");

router.get("/", auth, isAdmin, getUser);
router.get("/:id", getUserById);
router.post("/login", login);
router.post("/", createUser);
router.put("/:id", upload, updateDataUser);
router.delete("/:id", deleteDataUser);

module.exports = router;