const BookingModel = require('../models/bookingModel');
const ShowSeatStatusModel = require('../models/showSeatStatusModel');
const ShowModel = require('../models/showModel');

const createBooking = async (userId, showId, showSeats) => {
    // Verify the given seats are available for booking else throw error
    // Mark the given seats as "Blocked" and statusUpdateTime with currentTime.
    // Create a booking with status pending
    // Fetch showDetails for pricing
    // Calculate total amount and generate Invoice 
    // (BookingId, Show Information, Selected Seat Numbers, SeatType, Price per seat, platform Charges, Tax, Discount, Total Payable Amount, DateTime)

    // return Invoice
}

const confirmBooking = async (userId, bookingId, paymentDetails) => {
    // create a payment entry
    // verify the amount paid is equal to invoice amount then update Booking and showSeat Status 
    // and return confirmed Booking details.
    // else return another payment invoice with remaining amount.
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

module.exports = {
    createBooking,
    confirmBooking,
    findBookings,
    updateBookingFullfilled
}