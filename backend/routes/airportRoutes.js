const express = require('express');
const airportController = require('../src/controllers/airportController');

const router = express.Router();

router.get('/', airportController.getAllAirports);

module.exports = router;