const express = require('express');
const { getCarouselData, getMovies, getMovieDetail, addMovie } = require('../controllers/movieController');
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

// Carousel route
movieRouter.get('/carousel', getCarouselData);

module.exports = movieRouter;
