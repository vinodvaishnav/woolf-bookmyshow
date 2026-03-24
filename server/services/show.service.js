const showModel = require('../models/showModel');

const createShow = async (theaterId, movieId, screenId, showTime = null) => {
    // Create a new Show document with the provided details (theaterId, movieId, screenId, showTime).
    // Fetch the Seats from screenSeatModel for the given screenId 
    // Create a new Array for showSeat documents based on the fetched Seats, (seatId, seatType, status).
    // Create a unique set of SeatTypes from the fetched Seats and attach with Show document's pricing entries.
    // Save show document to the database.
    // Save showSeat documents to the database.

    // Return the newly created show document with populated movie, theater, screen, and pricing details.

    // As price are not set yet so keep the show object in inactive state and update it to active once price is set for all seat types.
}

const updatePricing = async (showId, seatTypePriceMap = []) => {
    // Fetch the show document by showId and update the price for the given seatTypeId in pricing entry.
    // If price is set for all seat types then update the show status to active.
    // return await showModel.findByIdAndUpdate(showId, { $set: { 'pricing.$[elem].price': price } }, { new: true, arrayFilters: [{ 'elem.seat_type': seatTypeId }] });
}

const activateShow = async (showId) => {
    // Fetch the show document by showId and check if price is set for all seat types in pricing entry, if not throw an error.
    return await showModel.findByIdAndUpdate(showId, { status: 'active' }, { new: false });
}


// filter can have movie_id, theater_id, screen_id, show_time
const findShows = async (filter = {}) => { }

module.exports = {
    addSeatTypePrices,
    activateShow,
    createShow,
    findShows,
    updatePricing,
};