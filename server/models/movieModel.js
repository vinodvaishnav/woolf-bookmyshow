const mongoose = require('mongoose');
const MovieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        thumbnail: {
            type: String,
            required: false,
            default: 'https://via.placeholder.com/150',
            get: v => v === undefined ? 'https://via.placeholder.com/150' : v
        },
        poster: {
            type: String,
            required: false,
            default: 'https://via.placeholder.com/150',
            get: v => v === undefined ? 'https://via.placeholder.com/150' : v
        },
        duration: {
            type: Number,
            required: false,
        },
        release_date: {
            type: Date,
            required: false,
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
            required: false,
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
            default: 'inactive'
        }
    },
    { toJSON: { getters: true }, toObject: { getters: true }, timestamps: true }
);

// @TODO: Add pre and post hooks.

module.exports = mongoose.model('movies', MovieSchema);