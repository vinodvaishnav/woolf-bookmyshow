const bookingService = require('../services/booking.service');
const InValidInputError = require('../exceptions/inValidInputError');
const Razorpay = require('razorpay');

const createBooking = async (req, res) => {
    const { loggedInUser, showId, showSeatIds } = req.body;
    try {
        const bookingDetail = await bookingService.createBooking(loggedInUser, showId, showSeatIds);
        res.status(201).json(bookingDetail);
    } catch (error) {
        if (error instanceof InValidInputError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.log("Error in createBooking controller: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const getBookings = async (req, res) => {
    const { loggedInUser } = req.body;
    try {
        const filter = { user: loggedInUser };
        const sort = { createdAt: -1 };
        const limit = 10;
        const orderBy = 'createdAt';
        const direction = -1;

        const bookings = await bookingService.findBookings(filter, limit, orderBy, direction);

        res.status(200).json(bookings);
    } catch (error) {
        console.log("Error in getBookings controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getBookingDetails = async (req, res) => {
    const { loggedInUser } = req.body;
    const bookingId = req.params.bookingId;
    try {
        const bookingDetail = await bookingService.getBookingDetails(loggedInUser, bookingId);
        if (!bookingDetail) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(bookingDetail);
    } catch (error) {
        console.log("Error in getBookingDetails controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const confirmBooking = async (req, res) => {
    const { loggedInUser, invoiceId, paymentDetails } = req.body;
    // @TODO: PaymentDetails can be encrypted to avoid any manipulation from client side. 
    // It can also be stored in DB in encrypted format for security reasons and decrypted here before processing.
    try {
        const confirmedBooking = await bookingService.confirmBooking(loggedInUser, invoiceId, paymentDetails);
        res.status(200).json(confirmedBooking);
    } catch (error) {
        console.log("Error in confirmBooking controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createBooking,
    getBookingDetails,
    getBookings,
    confirmBooking
}