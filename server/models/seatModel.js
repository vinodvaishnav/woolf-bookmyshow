const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    screen_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'screens',
        required: true
    },
    row: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        refs: 'seat_types',
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'restricted', 'maintenance'],
        required: true,
        default: 'available'
    }
});

SeatSchema.index({ screen_id: 1, row: 1, number: 1 }, { unique: true });

SeatSchema.virtual().get('seat_types').get(function () {
    const seatTypes = new Set();
    this.seats.forEach(seat => {
        seatTypes.add(seat.type.toString());
    });

    return seatTypes;
});

const Seat = mongoose.model('seats', SeatSchema);

module.exports = Seat;
