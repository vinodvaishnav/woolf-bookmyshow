const BookingModel = require('../models/bookingModel');
const ShowSeatStatusModel = require('../models/showSeatStatusModel');
const InvoiceModel = require('../models/invoiceModel');
const InValidInputError = require('../exceptions/inValidInputError');
const PaymentModel = require('../models/paymentModel');
const mongoose = require('mongoose');

const createBooking = async (userId, showId, showSeatIds) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const showSeats = await ShowSeatStatusModel
            .find({ show: showId, _id: { $in: showSeatIds } }).populate('show seat');

        // Validate the showId and showSeats with given showId else throw error
        if (showSeats.length !== showSeatIds.length) {
            throw new InValidInputError("Invalid seat numbers for the given show.");
        }

        // Verify the given seats are available for booking else throw error
        const unAvailableSeats = showSeats.filter(seat => seat.status.toLowerCase() !== "available");
        if (unAvailableSeats.length > 0) {
            throw new InValidInputError("Selected seats are not available for booking.");
        }

        // Mark the given seats as "Blocked" and statusUpdateTime with currentTime.
        ShowSeatStatusModel.updateMany(
            { showId: showId, _id: { $in: showSeatIds } },
            { $set: { status: "blocked", statusUpdateTime: new Date() } },
            { session }
        );

        // Calculate total amount and generate Invoice 
        let amount = showSeats.reduce((total, seat) => total + seat.show.pricing.find(p => p.seat_type.toString() === seat.seat.seat_type.toString()).price, 0);

        // Create a booking with status pending
        const booking = new BookingModel({
            user: userId,
            show: showId,
            seats: showSeatIds,
            status: "pending",
            amount: amount
        });

        await booking.save({ session });

        // Create an invoice for the booking
        const invoice = new InvoiceModel({
            booking: booking._id,
            platformCharges: 0, // Set platform charges as needed
            tax: 0, // Set tax as needed
            couponCode: null, // Set coupon code if applicable
            discount: 0, // Set discount as needed
            totalAmount: amount
        });

        await invoice.save({ session });

        await session.commitTransaction();

        // @TODO: Return booking details and showInformation along with invoice details if needed.
        return invoice;
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in createBooking service: ", error);
        throw error;
    } finally {
        session.endSession();
    }
}

const confirmBooking = async (userId, bookingId, paymentDetails) => {
    // verify the amount paid is equal to invoice amount then update Booking and showSeat Status 
    // and return confirmed Booking details.
    // else return another payment invoice with remaining amount.

    // create a payment entry
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // @TODO: Log the transaction in files for audit and debugging purpose.

        const payment = new PaymentModel({
            user: userId,
            booking: bookingId,
            invoice: paymentDetails.invoiceId,
            amount: paymentDetails.amount,
            paymentMethod: paymentDetails.method,
            paymentStatus: paymentDetails.status,
            paymentRef: paymentDetails.ref
        })
        await payment.save(session);

        const invoice = await InvoiceModel.find({ booking: bookingId });
        if (invoice.totalAmount !== paymentDetails.amount || paymentDetails.status.toLowerCase() !== "success") {
            throw new InValidInputError("Payment details do not match the invoice amount or payment status.");
            // return reminaing payment details if needed.
        }

        await BookingModel.findByIdAndUpdate(bookingId, { status: "completed" }, { session });
        await ShowSeatStatusModel.updateMany({ booking: bookingId }, { status: "booked" }, { session });

        session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in confirmBooking service: ", error);
        throw error;
    } finally {
        session.endSession();
    }
}

const verifyBooking = async (bookingId, showId) => {
    // IF the scanned bookingId is for olderShow or not confirmed Booking it throws error with proper message.
    // IF the scanned BookingId is for future show not within 1 hr return error saying future show
    // If the Booking is for correct show and marked as fullfilled return error

    // Updated scanned dateTime in Booking
    // Return Booking details
}

const updateBookingFullfilled = async (bookingId, numberOfGuest) => {
    // Update the booking with numberOfGuest Welcomed
}

const findBookings = async (filter = {}, limit = 20, orderBy = "_id", diretion = "1") => {
    // return bookings based on given parameteres.
}

const getBookingDetails = async (userId, bookingId) => {
    const booking = await BookingModel
        .findOne({ _id: bookingId, user: userId })
        .populate({
            path: 'show',
            populate: {
                path: 'movie',
                model: 'movies',
                select: 'name thumbnail'
            }
        })
        .populate({
            path: 'seats',
            populate: {
                path: 'seat',
                model: 'seats',
                select: 'row number type'
            }
        });

    return booking;
}

module.exports = {
    createBooking,
    confirmBooking,
    findBookings,
    getBookingDetails,
    updateBookingFullfilled
}