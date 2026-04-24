const bookingService = require('../services/booking.service');
const InValidInputError = require('../exceptions/inValidInputError');

const createBooking = async (req, res) => {
    const { userId, showId, showSeatIds } = req.body;
    try {
        const bookingDetail = await bookingService.createBooking(userId, showId, showSeatIds);
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

const getBookingDetails = async (req, res) => {
    const { userId, bookingId } = req.body;
    try {
        const bookingDetail = await bookingService.getBookingDetails(userId, bookingId);
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
    const { userId, bookingId, paymentDetails } = req.body;
    // @TODO: PaymentDetails can be encrypted to avoid any manipulation from client side. 
    // It can also be stored in DB in encrypted format for security reasons and decrypted here before processing.
    try {
        const confirmedBooking = await bookingService.confirmBooking(userId, bookingId, paymentDetails);
        res.status(200).json(confirmedBooking);
    } catch (error) {
        console.log("Error in confirmBooking controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createBooking,
    getBookingDetails,
    confirmBooking
}