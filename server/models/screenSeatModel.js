const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    screen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'screens',
        required: true
    },
    row: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seat_types',
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'restricted', 'maintenance'],
        required: true,
        default: 'available'
    }
}, { timestamps: true });

SeatSchema.index({ screen: 1, row: 1, number: 1 }, { unique: true });

// SeatSchema.virtual('seatTypes').get(function () {
//     const seatTypes = new Set();
//     this.seats.forEach(seat => {
//         seatTypes.add(seat.type.toString());
//     });

//     return Array.from(seatTypes);
// });

const ScreenSeatModel = mongoose.model('screen_seats', SeatSchema);

module.exports = ScreenSeatModel;

