const express = require('express');
const { getTheaters, getTheaterDetail, addTheater, updateTheater, deleteTheater, toggleTheaterStatus } = require('../controllers/theaterController');
const { authenticateUser } = require('../middlewares/authUser');

const theaterRouter = express.Router();

theaterRouter.use((req, res, next) => {
    console.log(req);
    next();
});

// Theater routes
theaterRouter.get('/', getTheaters);
theaterRouter.get('/:theaterId', getTheaterDetail);
theaterRouter.post('/', authenticateUser, addTheater);
theaterRouter.put('/:theaterId', authenticateUser, updateTheater);
theaterRouter.delete('/:theaterId', authenticateUser, deleteTheater);
theaterRouter.patch('/:theaterId/toggle-status', authenticateUser, toggleTheaterStatus);

module.exports = theaterRouter;