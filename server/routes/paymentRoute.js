const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { authenticateUser } = require('../middlewares/authUser');

const paymentRoute = express.Router();

paymentRoute.post('/create-order', authenticateUser, createPaymentOrder);
paymentRoute.post('/verify', authenticateUser, verifyPayment);

module.exports = paymentRoute;