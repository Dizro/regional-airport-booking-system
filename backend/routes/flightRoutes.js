const express = require('express');
const flightController = require('../src/controllers/flightController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

const flightSchema = Joi.object({
  flight_number: Joi.string().required(),
  departure_airport_id: Joi.number().integer().required(),
  arrival_airport_id: Joi.number().integer().required(),
  scheduled_departure: Joi.date().iso().required(),
  scheduled_arrival: Joi.date().iso().required(),
  aircraft_id: Joi.number().integer().required(),
  flight_status: Joi.string().required(),
  base_price: Joi.number().required(),
  price_business_multiplier: Joi.number().optional(),
  price_first_class_multiplier: Joi.number().optional()
});

router.get('/', flightController.getAllFlights);
router.get('/:id/booked-seats', flightController.getBookedSeats);
router.post('/', authMiddleware(['admin']), validationMiddleware(flightSchema), flightController.createFlight);
router.put('/:id', authMiddleware(['admin']), validationMiddleware(flightSchema), flightController.updateFlight);
router.delete('/:id', authMiddleware(['admin']), flightController.deleteFlight);

module.exports = router;