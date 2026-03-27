const showService = require('../services/show.service');

const createShow = async (req, res) => {
    try {
        const { theaterId, movieId, screenId, showTime } = req.body;
        const show = await showService.createShow(theaterId, movieId, screenId, showTime);
        res.status(201).json(show);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePricing = async (req, res) => {
    try {
        const { showId } = req.params;
        const seatTypePriceMap = req.body; // Expecting an array of { seatTypeId, price }
        const updatedShow = await showService.updatePricing(showId, seatTypePriceMap);
        res.status(200).json(updatedShow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activateShow = async (req, res) => {
    try {
        const { showId } = req.params;
        const activatedShow = await showService.activateShow(showId);
        res.status(200).json(activatedShow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const findShows = async (req, res) => {
    try {
        const filter = req.query; // Expecting query parameters for filtering
        const shows = await showService.findShows(filter);
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    activateShow,
    createShow,
    findShows,
    updatePricing,
};

