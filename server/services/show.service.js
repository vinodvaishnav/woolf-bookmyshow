const showModel = require('../models/showModel');
const screenModel = require('../models/screenModel');
const screenSeatModel = require('../models/screenSeatModel');
const showSeatStatusModel = require('../models/showSeatStatusModel');
const mongoose = require('mongoose');

const createShow = async (theaterId, movieId, screenId, showTime) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const screenSeats = await screenSeatModel.find({ screen: screenId });

        const seatTypes = new Set();
        screenSeats.forEach(screenSeat => {
            seatTypes.add(screenSeat.type.toString());
        });

        const pricing = Array.from(seatTypes).map(seatType => ({
            seat_type: seatType,
            price: -1, // Price will be set later
        }));

        const show = new showModel({
            theater: theaterId,
            movie: movieId,
            screen: screenId,
            showTime: showTime,
            pricing: pricing,
        });

        await show.save(session);

        const showSeatStatuses = screenSeats.map(screenSeat => ({
            show: show._id,
            seat: screenSeat._id,
            status: 'available',
        }));

        await showSeatStatusModel.insertMany(showSeatStatuses, { session });

        await session.commitTransaction();

        return show;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    // Create a new Show document with the provided details (theaterId, movieId, screenId, showTime).
    // Fetch the Seats from screenSeatModel for the given screenId 

    // Create a new Array for showSeat documents based on the fetched Seats, (seatId, seatType, status).
    // Create a unique set of SeatTypes from the fetched Seats and attach with Show document's pricing entries.
    // Save show document to the database.
    // Save showSeat documents to the database.

    // Return the newly created show document with populated movie, theater, screen, and pricing details.

    // As price are not set yet so keep the show object in inactive state and update it to active once price is set for all seat types.
    // console.log("createShow theaterId: ", theaterId, " movieId: ", movieId, " screenId: ", screenId, " showTime: ", showTime);
}

const updatePricing = async (showId, seatTypePriceMap = []) => {
    // Fetch the show document by showId and update the price for the given seatTypeId in pricing entry.
    // If price is set for all seat types then update the show status to active.
    // return await showModel.findByIdAndUpdate(showId, { $set: { 'pricing.$[elem].price': price } }, { new: true, arrayFilters: [{ 'elem.seat_type': seatTypeId }] });

    // If show is not active then only update the price.
    return await showModel.findOneAndUpdate(
        { _id: showId },
        {
            $set: { pricing: seatTypePriceMap }
        }
    );
}

const activateShow = async (showId) => {
    // Fetch the show document by showId and check if price is set for all seat types in pricing entry, if not throw an error.
    // return await showModel.findByIdAndUpdate(showId, { status: 'active' }, { new: false });
    return await showModel.findOneAndUpdate(
        { _id: showId },
        { status: 'active' }
    );
}

// filter can have movie_id, theater_id, screen_id, show_time
const findShows = async (filter = {}, orderBy = 'showTime', direction = 1, limit = 15, skip = 0) => {
    // Fetch the show documents based on the provided filter and return the list of shows with populated movie, theater, screen, and pricing details.
    console.log("find Shows filter: ", filter);
    const shows = await showModel.find(filter)
        .select('theater movie screen showTime pricing status')
        .populate({ path: 'movie', select: 'name thumbnail' })
        .populate({ path: 'screen', select: 'name' })
        .sort({ [orderBy]: direction })
        .skip(skip)
        .limit(limit);

    return shows;
}


const getShowSeats = async (showId) => {
    // Fetch the show document by showId and populate the showSeat details.
    const showSeats = await showSeatStatusModel.find({ show: showId })
        .select('seat status')
        .populate({ path: 'seat', select: 'row number type' });

    return showSeats;
}

module.exports = {
    activateShow,
    createShow,
    findShows,
    getShowSeats,
    updatePricing,
};