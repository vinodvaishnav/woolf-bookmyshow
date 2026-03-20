const mongoose = require('mongoose');
const TheaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'regions',
        required: true
    },
    address: {
        type: String,
        required: false,
    },
    mapCordinates: {
        latitude: {
            type: Number,
            required: false,
        },
        longitude: {
            type: Number,
            required: false,
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        default: 'active'
    },
}, { timestamps: true });

module.exports = mongoose.model('theaters', TheaterSchema);