const express = require('express');
const { createShow, updatePricing, activateShow, findShows } = require('../controllers/showController');
const { authenticateUser } = require('../middlewares/authUser');

const showRoute = express.Router();

showRoute.use((req, res, next) => {
    console.log(req);
    next();
});

// Show routes
showRoute.post('/', authenticateUser, createShow);
showRoute.put('/:showId/pricing', authenticateUser, updatePricing);
showRoute.put('/:showId/activate', authenticateUser, activateShow);
showRoute.get('/', findShows);

module.exports = showRoute;