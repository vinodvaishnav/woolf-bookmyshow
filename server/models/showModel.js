const mongoose = require('mongoose');
const { validate } = require('./permissionModel');

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theaters',
        required: true
    },
    screen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'screens',
        required: true
    },
    showTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        required: true,
        default: 'active'
    },
    pricing: [{
        seat_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'seat_types',
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

// It make show unique for a screen at a given time but only if it's active, 
// allowing multiple cancelled shows at the same time.
showSchema.index(
    { screen: 1, showTime: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'active' }
    }
);

const Show = mongoose.model('shows', showSchema);

module.exports = Show;