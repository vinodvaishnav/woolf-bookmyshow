const mongoose = require('mongoose');
const MovieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        poster: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        release_date: {
            type: Date,
            required: true
        },
        imdb_rating: {
            type: Number,
            required: false
        },
        imdb_comment: {
            type: String,
            required: false
        },
        genres: {
            type: String,
            required: true,
        },
        languages: {
            type: [String],
            required: false,
            default: ['English'],
            set: (val) => {
                if (typeof val === 'string') {
                    return val.split(',').map(item => item.trim());
                }
                return val;
            }
        },
        cast: {
            type: [String],
            required: false,
            default: [],
            set: (val) => {
                if (typeof val === 'string') {
                    return val.split(',').map(item => item.trim());
                }
                return val;
            }
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    { timestamps: true }
);

// @TODO: Add pre and post hooks.

module.exports = mongoose.model('movies', MovieSchema);