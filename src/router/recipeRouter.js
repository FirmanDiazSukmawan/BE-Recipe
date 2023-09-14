const express = require("express");
const router = express.Router();
const { findById, getRecipesQuery, postRecipes, putRecipes, deletRecipes,findByUsersId,getAllRecipes } = require("../controller/recipeController");
const upload = require("../middleware/multer");

router.get("/", getRecipesQuery);
router.get("/all", getAllRecipes);
router.get("/:recipe_id", findById);
router.get("/user/:users_id",findByUsersId);
router.post("/", upload, postRecipes);  
router.put("/:recipe_id", upload, putRecipes);
router.delete("/:recipe_id", deletRecipes);

module.exports = router;