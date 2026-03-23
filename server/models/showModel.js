const mongoose = require('mongoose');
const { validate } = require('./permissionModel');

const showSchema = new mongoose.Schema({
    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    },
    theater_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theaters',
        required: true
    },
    screen_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'screens',
        required: true
    },
    show_time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        required: true,
        default: 'active'
    },
    show_seat_type: {
        seat_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'seat_types',
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    seats: {
        type: [{
            row: {
                type: String,
                required: true
            },
            number: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ['available', 'booked', 'blocked', 'maintenance'],
                required: true,
                default: 'available'
            },
            type: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'seat_types',
                required: true
            }
        }],
        validate: {
            validator: function (seats) {
                // const seatSet = new Set();
                // for (const seat of seats) {
                //     const seatKey = `${seat.row}-${seat.number}`;
                //     if (seatSet.has(seatKey)) {
                //         return false; // Duplicate seat found
                //     }
                //     seatSet.add(seatKey);
                // }
                //@TODO: Write logic to validate that there are no duplicate seats in the array
                return true; // All seats are unique
            },
            message: 'Duplicate seats are not allowed.'
        },
        set: function (seats) {
            // Ensure that the seats are stored in a consistent order (e.g., sorted by row and number)
            return seats.sort((a, b) => {
                if (a.row === b.row) {
                    return a.number.localeCompare(b.number);
                }
                return a.row.localeCompare(b.row);
            });
        }
    }
}, { timestamps: true });

// It make show unique for a screen at a given time but only if it's active, 
// allowing multiple cancelled shows at the same time.
showSchema.index(
    { screen_id: 1, show_time: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'active' }
    }
);

showSchema.virtual().get('seat_types').get(function () {
    const seatTypes = new Map();
    this.seats.forEach(seat => {
        seatTypes.set(seat.type.toString(), seat.type.name ?? seat.type);
    });

    return seatTypes;
});

const Show = mongoose.model('shows', showSchema);

module.exports = Show;