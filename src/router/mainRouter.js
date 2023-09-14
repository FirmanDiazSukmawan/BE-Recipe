const express = require("express");
const router = express.Router();
// const categoryRouter = require("./categoryRouter");
const userRouter = require("./userRouter");
const recipeRouter = require("./recipeRouter");


router.use("/users", userRouter);
// router.use("/category", categoryRouter);
router.use("/recipe", recipeRouter);

module.exports = router;