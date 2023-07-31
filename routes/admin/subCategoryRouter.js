const express = require('express');
const router = new express.Router();
const subCategoryController = require('../../controllers/admin/subCategoryController');
// const {updateSubcategory}= require('../../controllers/admin/subCategoryController');

const validate  = require('../../middlewares/index');
const adminValidator = require('../../middlewares/adminValidators');

// console.log("test",subCategoryController.addSubCategory)
router.get("/subcategories", subCategoryController.getSubCategories);
router.get("/subcategories-of-category/:id", subCategoryController.getSubCategoriesOfCategory);
router.post("/subcategory", adminValidator.addSubCategoryValidator, validate, subCategoryController.addSubCategory);
router.patch("/subcategory/:id", adminValidator.addSubCategoryValidator, validate, subCategoryController.updateSubcategory);
router.delete("/subcategory/:id", subCategoryController.deleteSubcategory);


// router.post("/subcategory", adminValidator.addSubCategoryValidator, validate, async (req, res) => {
//     try {
//       const { name, description, image, category, status } = req.body;
//       const subCategory = await SubCategory.create({ name, description, image, category, status });
  
//       const cat = await Category.findByIdAndUpdate(
//         category?._id, {
//         $push: {
//           subcategory: subCategory
//         }
//       }, { new: true }
//       ).select("name");
  
//       subCategory.category = cat;
  
//       return res.status(201).json({ status: true, data: subCategory, message: "Subcategory successfully created." });
//     } catch (error) {
      
//       console.error("add error", error);
//       if (error.message && error.message.includes("duplicate key error collection")) {
//         return res.status(400).json({ status: false, message: "Subcategory with duplicate name." });
//       }
//       return res.status(400).json({ status: false, message: "Something went wrong while creating subcategory." });
//     }
// });
// router.patch("/subcategory/:id", updateSubcategory);


module.exports = router;
