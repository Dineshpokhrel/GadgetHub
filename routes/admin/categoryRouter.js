const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const adminValidator = require('../../middlewares/adminValidators');
const validate  = require('../../middlewares/index');
const Category = require('../../models/category');

router.get("/categories", categoryController.getCategories);
router.post("/category", adminValidator.addCategoryValidator, validate, categoryController.addCategory);
router.put("/category/:id", adminValidator.addCategoryValidator, validate, categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);








// router.post("/category", adminValidator.addCategoryValidator, validate, async (req,res)=> {
//     try {
//         const { name, description, image, status } = req.body;
//         const category = await Category.create({ name, description, image, status });
//         res.status(201).json({
//             status: true,
//             data: category,
//             message: "Category successfully created."
//         });
//     } catch (error) {
//         if (error.message && error.message.includes("duplicate key error collection")) {
//             res.status(409).json({ message: "Category with duplicate name.", status: false });
//             return;
//         }

//         console.error(error.message);
//         res.status(400).json({
//             status: false,
//             message: "Error occurred while creating category."
//         });
//     }
// });

module.exports = router;
