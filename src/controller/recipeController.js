const { findRecipesId, recipesQuery, createRecipes, updateRecipes, deleteRecipes } = require("../model/recipeModel");
const cloudinary = require("../config/cloudinaryConfig");
const recipeController = {

    getRecipesQuery: async (req, res) => {
        let { searchBy, search, sortBy, sort, limit, offset } = req.query;
        let data = {
            searchBy: searchBy || "name_recipes",
            search: search || "",
            sortBy: sortBy || "name_recipes",
            sort: sort || "ASC",
            limit: limit || 10,
            offset: offset || 0
        };
        try {
            let results = await recipesQuery(data);
            res.status(200).json({
                message: "recipes got by query",
                data: results.rows
            });
        }
        catch (err) {
            res.status(400).json({
                error: err.message,
                message: "data not found"
            });
        }
    },

    findById: async (req, res) => {
        const id = req.params.id;
        try {

            let result = await findRecipesId(id);
            res.status(200).json({ data: result.rows });
            // console.log(result);
        }
        catch (err) {
            res.status(400).json({
                error: err.message,
                message: "error finding recipes"
            });
        }
    },




    postRecipes: async (req, res) => {
        let recipesImage = await cloudinary.uploader.upload(req.file.path, { folder: "recipe" });

        if (!recipesImage) {
            return res.json({ messsage: "need upload image" });
        }

        try {
            let recipe = {
                name_recipes: req.body.name_recipes,
                image: recipesImage.secure_url,
                ingredients: req.body.ingredients,
                users_id: req.body.users_id,
                category_id: req.body.category_id,
                description: req.body.description
            };
            let recipeData = await createRecipes(recipe);
            // console.log(recipe);
            res.status(200).json({
                message: "create recipe succesfully",
                data: recipeData.rows
            });
        } catch (err) {
            res.status(400).json({
                err: err.message,
                message: "error create recipes"

            });
        }
    },

    putRecipes: async (req, res) => {
        let { id } = req.params;
        let recipesImage = await cloudinary.uploader.upload(req.file.path, { folder: "recipe" });

        if (!recipesImage) {
            return res.json({ messsage: "need upload image" });
        }


        try {
            let recipe = await findRecipesId(Number(id));
            let data = recipe.rows[0];
            // console.log(data);
            let recipeData = {
                name_recipes: req.body.name_recipes || data.name_recipes,
                image: recipesImage.secure_url || data.image,
                ingredients: req.body.ingredients || data.ingredients,
                users_id: req.body.users_id || data.users_id,
                category_id: req.body.category_id || data.category_id,
                description: req.body.description || data.description
            };
            // console.log(recipeData);
            await updateRecipes(recipeData, Number(id));
            res.status(200).json({
                message: "recipe updated successfully"
            });

        } catch (err) {
            res.status(400).json({
                error: err.message,
                message: "error update recipe"
            });
        }
    },

    deletRecipes: async (req, res) => {
        let { id } = req.params;
        try {
            await deleteRecipes(id);
            res.status(200).json({
                message: "recipe deleted successfully"
            });
        }
        catch (err) {
            res.status(400).json({
                err: err.message,
                message: "error deleting"

            });
        }

    }


};

module.exports = recipeController;