const express = require('express');
const {
    createBooking,
    getBookingDetails,
    confirmBooking
} = require('../controllers/bookingController');

const { authenticateUser } = require('../middlewares/authUser');

const bookingRoute = express.Router();

bookingRoute.post('/', authenticateUser, createBooking);
bookingRoute.get('/details', authenticateUser, getBookingDetails);
bookingRoute.post('/confirm', authenticateUser, confirmBooking);

module.exports = bookingRoute;