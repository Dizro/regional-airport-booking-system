const express = require('express');
const analyticsController = require('../src/controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/sales', authMiddleware(['admin']), analyticsController.getSalesReport);
router.get('/load', authMiddleware(['admin']), analyticsController.getLoadReport);
router.get('/cashier-activity', authMiddleware(['admin']), analyticsController.getCashierActivityReport);

module.exports = router;