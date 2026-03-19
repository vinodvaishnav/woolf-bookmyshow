const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema({
    name: {
        type: String, // ['user', 'admin', 'partner', 'operator'],
        required: true,
        unique: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'permissions'
    }],
    description: {
        type: String,
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('user_roles', UserRoleSchema);
