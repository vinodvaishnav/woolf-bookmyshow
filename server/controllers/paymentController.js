const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});

const createPaymentOrder = async (req, res) => {
    try {
        const { amount, invoiceId } = req.body;

        const options = {
            amount: amount * 100, // Razorpay expects amount in paisa
            currency: 'INR',
            receipt: `receipt_${invoiceId}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = req.body;
        const userId = req.user._id; // From authenticateUser middleware

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment verified, now confirm the booking
            const { confirmBooking } = require('./bookingController');

            // Get invoice to get booking id and amount
            const InvoiceModel = require('../models/invoiceModel');
            const invoice = await InvoiceModel.findById(invoiceId);
            if (!invoice) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }

            await confirmBooking(userId, invoice.booking, {
                invoiceId,
                amount: invoice.totalAmount,
                method: 'razorpay',
                status: 'success',
                ref: razorpay_payment_id,
            });

            res.status(200).json({
                success: true,
                message: 'Payment verified and booking confirmed',
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification error',
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
};