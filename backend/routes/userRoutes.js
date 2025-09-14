const express = require('express');
const userController = require('../src/controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware(), userController.getProfile);
router.put('/profile', authMiddleware(), userController.updateProfile);

router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.get('/search', authMiddleware(['admin', 'cashier']), userController.searchUsers);
router.put('/:id', authMiddleware(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

module.exports = router;