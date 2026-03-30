const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookings',
        require: true
    },
    platformCharges: {
        type: Number,
        require: true,
        min: 0,
    },
    tax: {
        type: Number,
        require: true,
        min: 0,
    },
    couponCode: {
        type: String,
    },
    discount: {
        type: Number,
        require: true,
        min: 0,
    },
    totalAmount: {
        type: Number,
        require: true,
        min: 0,
    },
}, { timestamps: true });

const invoiceModel = mongoose.model('invoices', invoiceSchema);

module.exports = invoiceModel;