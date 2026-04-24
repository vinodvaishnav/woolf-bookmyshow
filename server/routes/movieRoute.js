const express = require('express');
const { getCarouselData, getMovies, getMovieDetail, addMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { authenticateUser } = require('../middlewares/authUser');

const movieRouter = express.Router();

movieRouter.use((req, res, next) => {
    console.log(req);
    next();
});

// Movie routes
movieRouter.get('/', getMovies);
movieRouter.get('/:movieId', getMovieDetail);
movieRouter.post('/', authenticateUser, addMovie);
movieRouter.put('/:movieId', authenticateUser, updateMovie);
movieRouter.delete('/:movieId', authenticateUser, deleteMovie);

// Carousel route
movieRouter.get('/carousel', getCarouselData);

module.exports = movieRouter;
