const mongoose = require('mongoose');
const SeatTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theaters',
        required: true
    }
}, { timestamps: true });

SeatTypeSchema.index({ name: 1, theater: 1 }, { unique: true });

module.exports = mongoose.model('seat_types', SeatTypeSchema)