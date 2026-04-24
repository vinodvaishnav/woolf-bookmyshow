const TheaterModel = require('../models/theaterModel');

const getTheaters = async (where = null, limit = 20, orderBy = "_id", direction = 1) => {
    const theaters = await TheaterModel
        .find(where)
        .populate('region', 'name')
        .select('name region address mapCordinates contactPerson contactEmail contactPhone status')
        .limit(limit)
        .sort({
            [orderBy]: direction
        });

    return theaters;
}

const getTheaterDetail = async (theaterId) => {
    const theater = await TheaterModel.findById(theaterId).populate('region', 'name');
    return theater;
}

const addTheater = async (theaterData) => {
    const newTheater = new TheaterModel(theaterData);
    await newTheater.save();
    return newTheater;
}

const updateTheater = async (theaterId, updateData) => {
    const updatedTheater = await TheaterModel.findByIdAndUpdate(theaterId, updateData, { new: true });
    return updatedTheater;
}

const deleteTheater = async (theaterId) => {
    const deletedTheater = await TheaterModel.findByIdAndDelete(theaterId);
    return deletedTheater;
}

const toggleTheaterStatus = async (theaterId) => {
    const theater = await TheaterModel.findById(theaterId);
    if (!theater) {
        return null;
    }

    theater.status = theater.status === 'active' ? 'inactive' : 'active';
    await theater.save();
    return theater;
}

module.exports = {
    getTheaters,
    getTheaterDetail,
    addTheater,
    updateTheater,
    deleteTheater,
    toggleTheaterStatus
}