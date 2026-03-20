const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    module: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }
}, { timestamps: true });

permissionSchema.index({ module: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('permissions', permissionSchema);