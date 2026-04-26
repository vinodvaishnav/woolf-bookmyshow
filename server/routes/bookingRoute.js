const express = require('express');
const {
    createBooking,
    getBookingDetails,
    confirmBooking,
    getBookings
} = require('../controllers/bookingController');

const { authenticateUser } = require('../middlewares/authUser');

const bookingRoute = express.Router();

bookingRoute.get('/', authenticateUser, getBookings);
bookingRoute.get('/:bookingId', authenticateUser, getBookingDetails);
bookingRoute.post('/', authenticateUser, createBooking);
bookingRoute.post('/confirm', authenticateUser, confirmBooking);

module.exports = bookingRoute;