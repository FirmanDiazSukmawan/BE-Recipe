const express = require("express");
const router = express.Router();
const { findById, getRecipesQuery, postRecipes, putRecipes, deletRecipes } = require("../controller/recipeController");

router.get("/", getRecipesQuery);
router.get("/:id", findById);
router.post("/", postRecipes);
router.put("/:id", putRecipes);
router.delete("/:id", deletRecipes);

module.exports = router;