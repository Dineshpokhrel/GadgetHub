const express = require('express');
const brandController = require('../../controllers/admin/brandController');
const adminValidator = require('../../middlewares/adminValidators');
const validate = require('../../middlewares/index');

const router = express.Router();

router.get('/brands', brandController.getBrands);

router.post('/brand', adminValidator.addBrandValidator, validate, brandController.addBrand);

router.put('/brand/:id', adminValidator.addBrandValidator, validate, brandController.updateBrand);

router.delete('/brand/:id', brandController.deleteBrand);

module.exports = router;