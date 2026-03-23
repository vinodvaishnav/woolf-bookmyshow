const showModel = require('../models/showModel');

const createShow = async (theaterId, movieId, screenId, showTime = null) => { }
const addSeatTypePrices = async (showId, seatTypes = []) => { }

// filter can have movie_id, theater_id, screen_id, show_time
const findShows = async (filter = {}) => { }

module.exports = {
    createShow,
    addSeatTypePrices,
    findShows
};