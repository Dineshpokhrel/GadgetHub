const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const authValidators = require('../../middlewares/authValidators')
const validation = require ('../../middlewares/validateRegistration')


router.post("/register",validation.validateRegistration, userController.registerUser);
router.post('/login', validation.validateLogin, userController.loginUser);
router.get('/users/', userController.getAllUsers);
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
 