const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shows',
        require: true
    },
    seats: [{ // It can be removed from here as we can get it from showSeatStatus, but keeping it here for easy access and to avoid multiple DB calls.
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'show_seat_status',
        require: true
    }],
    amount: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true,
        enum: ['pending', 'completed', 'canceled', 'rejected'],
        default: 'pending',
    },
    ticketScannedAt: [{
        type: Date
    }],
    guestWelcomed: {
        type: Number
    }


}, { timestamps: true });

const bookingModel = mongoose.model('bookings', bookingSchema);

module.exports = bookingModel;
// Booking
// - id
//  - created_at
// - updated_at
// - status (Pending | Completed | Canceled)
// - amount
// - user_id
// - show_seat_ids

