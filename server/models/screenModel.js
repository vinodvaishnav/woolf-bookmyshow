const mongoose = require('mongoose');
const SEAT_TYPES = require('../constants/seatType');

const SeatSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
    },
    row: {
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
        enum: ['active', 'inactive'],
        required: true,
        default: 'active'
    }
});

const ScreenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theaters',
        required: true
    },
    totalSeats: {
        type: Number,
        required: true,
    },
    seats: [SeatSchema],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('screens', ScreenSchema);