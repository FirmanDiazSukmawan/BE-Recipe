const db = require("../config/db");

const recipesQuery = (data) => {
    let { searchBy, search, sortBy, sort, limit, offset } = data;
    return db.query(`SELECT food_recipes.recipes_id, food_recipes.name_recipes, food_recipes.description, category.name AS category, users.username AS creator, food_recipes.image 
    FROM food_recipes
	JOIN category ON food_recipes.category_id = category.id
	JOIN users ON food_recipes.users_id = users.users_id WHERE food_recipes.${searchBy} ILIKE '%${search}%' ORDER BY food_recipes.${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

const AllRecipes = () => {
    return db.query("SELECT * FROM food_recipes ");
};

const findRecipesId = (recipes_id) => {
    return db.query(`SELECT * FROM food_recipes WHERE food_recipes.recipes_id = ${recipes_id}`);
};

const getRecipesByUsersId = (users_id) => {
    return db.query(`SELECT
    food_recipes.recipes_id,
    food_recipes.name_recipes,
    food_recipes.image,
    users.username AS creator,
    TO_CHAR(food_recipes.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at
FROM food_recipes
JOIN users ON food_recipes.users_id = users.users_id
WHERE users.users_id = $1`,[users_id]);
};

const createRecipes = (data) => {
    const { name_recipes, image, ingredients, users_id, category_id, description } = data;
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO food_recipes (name_recipes,image,ingredients,users_id,category_id,created_at,description) 
        VALUES ('${name_recipes}','${image}','${ingredients}',${users_id},${category_id},CURRENT_TIMESTAMP,'${description}')`, (err, res) => {
            if (!err) {
                resolve(res);
            }
            else {
                reject(err.message);
            }

        });

    });
};

const updateRecipes = (data, recipe_id) => {
    const { name_recipes, image, ingredients, users_id, category_id, description } = data;
    return db.query(`UPDATE food_recipes SET name_recipes = '${name_recipes}', image = '${image}',ingredients= '${ingredients}',users_id=${users_id},category_id = ${category_id},created_at = CURRENT_TIMESTAMP ,description = '${description}' WHERE food_recipes.recipes_id=${recipe_id}`);

};

const deleteRecipes = (recipes_id) => {
    return db.query(`DELETE FROM food_recipes WHERE food_recipes.recipes_id = ${recipes_id}`);
};
module.exports = { findRecipesId, recipesQuery, createRecipes, updateRecipes, deleteRecipes,getRecipesByUsersId,AllRecipes };