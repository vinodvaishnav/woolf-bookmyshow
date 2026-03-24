const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    show_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shows',
        required: true
    },
    seat_id: {
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

showSchema.index({ show_id: 1, seat_id: 1 }, { unique: true });

const ShowSeatStatus = mongoose.model('show_seat_status', showSchema);

module.exports = ShowSeatStatus;