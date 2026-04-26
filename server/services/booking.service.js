const BookingModel = require('../models/bookingModel');
const ShowSeatStatusModel = require('../models/showSeatStatusModel');
const InvoiceModel = require('../models/invoiceModel');
const InValidInputError = require('../exceptions/inValidInputError');
const PaymentModel = require('../models/paymentModel');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getBookingDetails = async (userId, bookingId) => {
    const booking = await BookingModel
        .findOne({ _id: bookingId, user: userId })
        .populate({
            path: 'show',
            populate: [{
                path: 'movie',
                model: 'movies',
                select: 'name thumbnail'
            }, {
                path: 'theater',
                model: 'theaters',
                select: 'name'
            }]
        })
        .populate({
            path: 'seats',
            populate: [
                {
                    path: 'seat',
                    model: 'screen_seats',
                    select: 'row number type'
                }
            ]
        });
    // console.log("Booking details: ", booking);
    return booking;
}

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
        const blockResult = await ShowSeatStatusModel.updateMany(
            { show: showId, _id: { $in: showSeatIds } },
            { $set: { status: "blocked", statusUpdateTime: new Date() } },
            { session }
        );

        // console.log("Blocked Seats: ", showSeats);
        // console.log("Seat block update result:", blockResult);

        // Debug: Log showSeats data
        // console.log("showSeats data:", JSON.stringify(showSeats.map(seat => ({
        //     _id: seat._id,
        //     show: seat.show ? { _id: seat.show._id, pricing: seat.show.pricing } : null,
        //     seat: seat.seat ? { _id: seat.seat._id, type: seat.seat.type } : null,
        //     status: seat.status
        // })), null, 2));

        // Calculate total amount and generate Invoice 
        let amount = showSeats.reduce((total, seat) => {
            if (!seat.show || !seat.show.pricing) {
                throw new InValidInputError(`Show pricing not available for seat ${seat._id}`);
            }
            if (!seat.seat || !seat.seat.type) {
                throw new InValidInputError(`Seat type not available for seat ${seat._id}`);
            }
            const pricing = seat.show.pricing.find(p => p.seat_type && p.seat_type.toString() === seat.seat.type.toString());
            if (!pricing) {
                throw new InValidInputError(`No pricing found for seat type ${seat.seat.type} in show ${seat.show._id}`);
            }
            return total + pricing.price;
        }, 0);

        // Create a booking with status pending
        const booking = new BookingModel({
            user: userId,
            show: showId,
            seats: showSeatIds,
            status: "pending",
            amount: amount
        });

        await booking.save({ session });

        const options = {
            amount: amount * 100, // Razorpay expects amount in paisa
            currency: 'INR',
            receipt: `receipt_${booking._id}`,
        };

        const order = await razorpay.orders.create(options);

        // Create an invoice for the booking
        const invoice = new InvoiceModel({
            booking: booking._id,
            platformCharges: 0, // Set platform charges as needed
            tax: 0, // Set tax as needed
            couponCode: null, // Set coupon code if applicable
            discount: 0, // Set discount as needed
            totalAmount: amount,

        });

        await invoice.save({ session });

        await session.commitTransaction();

        const response = {
            ...invoice.toObject(),
            order,
            razorpayKey: process.env.RAZORPAY_KEY_ID
        }

        return response;

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.log("Error in createBooking service: ", error);
        throw error;
    } finally {
        session.endSession();
    }
}

const verifyPayment = async (invoice, paymentDetails) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            throw new Error('Payment verification failed');
        }

    } catch (error) {
        throw error;
    }
}

const confirmBooking = async (userId, invoiceId, paymentDetails) => {
    // verify the amount paid is equal to invoice amount then update Booking and showSeat Status 
    // and return confirmed Booking details.
    // else return another payment invoice with remaining amount.

    // console.log("Confirm Booking - Service Layer: ", { userId, invoiceId, paymentDetails });
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) {
        throw new InValidInputError("Invoice not found for the given booking.");
    }

    // console.log("Invoice details: ", invoice);

    verifyPayment(invoice, paymentDetails);

    console.log("Payment verified successfully for invoice: ");
    // create a payment entry
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const payment = new PaymentModel({
            user: userId,
            booking: invoice.booking,
            invoice: invoice._id,
            amount: invoice.totalAmount,
            paymentStatus: 'success',
            paymentRef: paymentDetails.razorpay_payment_id
        });
        await payment.save({ session });

        // console.log("Payment record created: ", payment);

        const updatedBooking = await BookingModel.findByIdAndUpdate(invoice.booking, { status: "completed" }, { session, new: true });

        // console.log("Booking updated to completed: ", updatedBooking);

        for (const seat of updatedBooking.seats) {
            await ShowSeatStatusModel.updateOne({ _id: seat }, { status: "booked" }, { session });
        }

        // console.log("Show seat status updat¬ed to booked for booking: ", invoice.booking);

        await session.commitTransaction();

        return invoice;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
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

const findBookings = async (filter = {}, limit = 20, orderBy = "_id", diretion = 1) => {
    // console.log("Finding bookings with filter: ", filter);
    const bookings = await BookingModel
        .find(filter)
        .populate({
            path: 'show',
            select: 'theater screen showTime',
            populate: [{
                path: 'movie',
                model: 'movies',
                select: 'name thumbnail'
            }, {
                path: 'theater',
                model: 'theaters',
                select: 'name region'
            }]
        });

    // console.log("Booking details: ", bookings);
    return bookings;
}

module.exports = {
    createBooking,
    confirmBooking,
    findBookings,
    getBookingDetails,
    updateBookingFullfilled
}