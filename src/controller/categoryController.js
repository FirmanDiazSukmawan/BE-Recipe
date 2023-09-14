// const { readCategory, findCategoryId, createCategory, updateCategory, deleteCategory } = require("../model/categoryModel");

// const categoryController = {
//     getCategory: async (req, res) => {
//         try {
//             let result = await readCategory();
//             res.json({
//                 message: "category has been read successfully",
//                 data: result.rows
//             });
//         } catch (err) {
//             res.json({
//                 error: err.message,
//                 message: "error reading category"
//             });
//         }
//     },

//     getCategoryById: async (req, res) => {
//         const id = req.params.id;
//         let result = await findCategoryId(id);
//         try {
//             res.json({
//                 message: "category has been found",
//                 data: result.rows
//             });

//         } catch (err) {
//             res.json({
//                 error: err.message,
//                 message: "error getting category"
//             });
//         }
//     },
//     createDataCategory: async (req, res) => {
//         let { name } = req.body;
//         try {
//             await createCategory(name);
//             res.status(201).json({
//                 message: "category has been created",
//             });
//         } catch (err) {
//             res.status(400).json({
//                 message: "error creating category",
//                 error: err.message
//             });
//         }
//     },

//     updateDataCategory: async (req, res) => {

//         try {
//             let { id } = req.params;
//             let { name } = req.body;
//             let data = name;

//             await updateCategory(data, Number(id));

//             res.status(202).json({
//                 message: "category has been updated"
//             });
//         } catch (err) {
//             res.status(400).json({
//                 error: err.message,
//                 message: "error updating category"

//             });
//         }
//     },

//     deleteDataCategory: async (req, res) => {
//         let id = req.params.id;
//         const result = await deleteCategory(id);
//         try {
//             await deleteCategory(id);
//             res.json({
//                 message: "category has been deleted",
//                 data: `id${result} has been deleted`
//             });
//         } catch (err) {
//             res.json({
//                 error: err.message,
//                 message: "error deleting category"
//             });
//         }

//     }

// };

// module.exports = categoryController;