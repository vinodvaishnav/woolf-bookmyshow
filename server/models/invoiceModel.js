const mongoose = require('mongoose');
const invoiceSchema = mongoose.Schema({
    // (BookingId, Show Information, Selected Seat Numbers, SeatType, Price per seat, platform Charges, Tax, Discount, Total Payable Amount, DateTime)

}, { timestamps: true });
const invoiceModel = mongoose.model('invoices', invoiceSchema);

module.exports = invoiceModel;