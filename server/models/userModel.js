const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_roles',
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        required: true,
        default: 'active'
    },
    email_verified: {
        type: Boolean,
        required: true,
        default: false
    },
    phone_verified: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true });

// @TODO: add pre and post hooks
const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
