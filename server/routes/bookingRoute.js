const express = require('express');
const {
    createBooking,
    getBookingDetails,
    confirmBooking
} = require('../controllers/bookingController');

const bookingRoute = express.Router();

bookingRoute.post('/', createBooking);
bookingRoute.get('/details', getBookingDetails);
bookingRoute.post('/confirm', confirmBooking);

module.exports = bookingRoute;