const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const validate  = require('../../middlewares/index');
const adminValidator = require('../../middlewares/adminValidators');

router.get("/products", productController.getProducts);
router.post("/product", adminValidator.addProductValidator, validate, productController.addProduct);
router.patch("/product/:id", adminValidator.addCategoryValidator, validate, productController.updateProduct);
router.delete("/product/:id", productController.deleteProduct);

module.exports = router;
