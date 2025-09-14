const express = require('express');
const bookingController = require('../src/controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

const bookingSchema = Joi.object({
  flight_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().allow(null),
  total_cost: Joi.number().required(),
  tickets: Joi.array().items(Joi.object({
    ticket_id: Joi.number().integer().optional(),
    passenger_full_name: Joi.string().required(),
    passenger_document_number: Joi.string().required(),
    seat_number: Joi.string().allow(null, '').optional(),
    service_class: Joi.string().required(),
    final_price: Joi.number().required()
  })).min(1).required()
});

const processCancellationSchema = Joi.object({
  action: Joi.string().valid('confirm', 'reject').required()
});

router.get('/', authMiddleware(), bookingController.getBookings);
router.get('/:id', authMiddleware(['user', 'cashier', 'admin']), bookingController.getBookingById);
router.post('/', authMiddleware(['cashier', 'admin']), validationMiddleware(bookingSchema), bookingController.createBooking);
router.put('/:id', authMiddleware(['cashier', 'admin']), validationMiddleware(bookingSchema), bookingController.updateBooking);
router.put('/:id/request-cancellation', authMiddleware(['user']), bookingController.requestBookingCancellation);
router.put('/:id/process-cancellation', authMiddleware(['cashier', 'admin']), validationMiddleware(processCancellationSchema), bookingController.processBookingCancellation);
router.put('/:id/force-cancel', authMiddleware(['cashier', 'admin']), bookingController.forceCancelBooking);

module.exports = router;