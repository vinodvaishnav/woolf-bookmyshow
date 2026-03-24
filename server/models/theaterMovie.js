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
    firstShowDate: {
        type: Date,
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('theater_movies', TheaterMovieSchema);

