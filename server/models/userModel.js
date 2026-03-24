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
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        required: true,
        default: 'active'
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true });

// @TODO: add pre and post hooks
const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
