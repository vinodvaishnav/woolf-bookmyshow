const mongoose = require('mongoose');
const MovieRatingSchema = new mongoose.Schema(
    {
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movies',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('movie_ratings', MovieRatingSchema);