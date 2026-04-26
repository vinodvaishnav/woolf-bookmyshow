const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookings',
        require: true
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'invoices',
        require: true
    },
    amount: {
        type: Number,
        require: true,
        min: 1
    },
    paymentMethod: {
        type: String,
        require: false
    },
    paymentRef: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['inprogress', 'success', 'failed', 'canceled'],
        require: true,
    }
}, { timestamps: true });

const paymentModel = mongoose.model('payments', paymentSchema);

module.exports = paymentModel;

// Payment
//  - id
//  - created_at
// - updated_at
// - payment_status (Success | failed | inprogress)
// - payment_method
// - reference_id
// - amount
// - booking_id
// - user_id