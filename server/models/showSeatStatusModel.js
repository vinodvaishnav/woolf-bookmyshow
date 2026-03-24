const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shows',
        required: true
    },
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seats',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'blocked', 'maintenance'],
        required: true,
        default: 'available'
    }
}, { timestamps: true });

showSchema.index({ show: 1, seat: 1 }, { unique: true });

const ShowSeatStatus = mongoose.model('show_seat_status', showSchema);

module.exports = ShowSeatStatus;