const express = require("express");
const router = express.Router();
const { getUser, getUserById, updateDataUser, deleteDataUser, createUser, login, selectPage } = require("../controller/userController");
const { isAdmin, isUser } = require("../middleware/auth");
const auth = require("../middleware/verifyRole");
const hitById = require("../middleware/redis");
const upload = require("../middleware/multer");

router.get("/paginate", selectPage)
router.get("/", auth, isAdmin, getUser);
router.get("/:id", auth, isUser, getUserById);
router.get("/getFromRedis/:id", hitById, getUserById);
router.get("/:id", getUserById);
router.post("/login", login);
router.post("/", createUser);
router.put("/:id", upload, updateDataUser);
router.delete("/:id", deleteDataUser);

module.exports = router;
