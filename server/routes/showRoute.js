const express = require('express');
const { createShow, updatePricing, activateShow, findShows, getShowSeats, findShowsByMovie } = require('../controllers/showController');
const { authenticateUser } = require('../middlewares/authUser');

const showRoute = express.Router();

showRoute.use((req, res, next) => {
    console.log(req);
    next();
});

// Show routes
// showRoute.post('/', authenticateUser, createShow);
// showRoute.put('/:showId/pricing', authenticateUser, updatePricing);
// showRoute.put('/:showId/activate', authenticateUser, activateShow);
showRoute.post('/', createShow);
showRoute.put('/:showId/pricing', updatePricing);
showRoute.put('/:showId/activate', activateShow);
showRoute.get('/:showId/seats', getShowSeats);
showRoute.get('/movie/:movieId', findShowsByMovie);
showRoute.get('/', findShows);

module.exports = showRoute;