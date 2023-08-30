const db = require("../config/db");

const recipesQuery = (data) => {
    let { searchBy, search, sortBy, sort, limit, offset } = data;
    return db.query(`SELECT food_recipes.id, food_recipes.name_recipes, food_recipes.description, category.name AS category, users.username as creator, food_recipes.image 
    FROM food_recipes
	JOIN category ON food_recipes.category_id = category.id
	JOIN users ON food_recipes.users_id = users.id WHERE food_recipes.${searchBy} ILIKE '%${search}%' ORDER BY food_recipes.${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

const findRecipesId = (id) => {
    return db.query(`SELECT * FROM food_recipes WHERE food_recipes.id = ${id}`);
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

const updateRecipes = (data, id) => {
    const { name_recipes, image, ingredients, users_id, category_id, description } = data;
    return db.query(`UPDATE food_recipes SET name_recipes = '${name_recipes}', image = '${image}',ingredients= '${ingredients}',users_id=${users_id},category_id = ${category_id},created_at = CURRENT_TIMESTAMP ,description = '${description}' WHERE food_recipes.id=${id}`);

};

const deleteRecipes = (id) => {
    return db.query(`DELETE FROM food_recipes WHERE food_recipes.id = ${id}`);
};
module.exports = { findRecipesId, recipesQuery, createRecipes, updateRecipes, deleteRecipes };