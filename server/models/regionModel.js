const mongoose = require('mongoose');
const RegionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('regions', RegionSchema);