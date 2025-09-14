const express = require('express');
const authController = require('../src/controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

const registerSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().min(6).required(),
  user_role: Joi.string().valid('user', 'cashier', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validationMiddleware(registerSchema), authController.register);
router.post('/login', validationMiddleware(loginSchema), authController.login);

module.exports = router;