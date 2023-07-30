const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

router.get('/users', userController.getUsers);
router.patch('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.post("/register", userController.registerUser);

module.exports = router;
