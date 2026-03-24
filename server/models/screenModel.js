const mongoose = require('mongoose');

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
    screenType: {
        type: String,
        enum: ['2D', '3D', 'IMAX'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('screens', ScreenSchema);