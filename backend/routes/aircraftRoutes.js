const express = require('express');
const aircraftController = require('../src/controllers/aircraftController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', aircraftController.getAllAircrafts);
router.post('/', authMiddleware(['admin']), aircraftController.createAircraft);
router.put('/:id', authMiddleware(['admin']), aircraftController.updateAircraft);
router.delete('/:id', authMiddleware(['admin']), aircraftController.deleteAircraft);

module.exports = router;