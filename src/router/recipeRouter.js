const express = require("express");
const router = express.Router();
const { findById, getRecipesQuery, postRecipes, putRecipes, deletRecipes } = require("../controller/recipeController");
const upload = require("../middleware/multer");

router.get("/", getRecipesQuery);
router.get("/:id", findById);
router.post("/", upload, postRecipes);
router.put("/:id", upload, putRecipes);
router.delete("/:id", deletRecipes);

module.exports = router;