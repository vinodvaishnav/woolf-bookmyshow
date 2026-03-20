const mongoose = require('mongoose');
const TheaterMovieSchema = new mongoose.Schema({
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theaters',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    },
    first_show_date: {
        type: Date,
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('theater_movies', TheaterMovieSchema);

