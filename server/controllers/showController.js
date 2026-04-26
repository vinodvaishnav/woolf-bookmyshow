const showService = require('../services/show.service');

const createShow = async (req, res) => {
    try {
        const { theaterId, movieId, screenId, showTime } = req.body;
        const show = await showService.createShow(theaterId, movieId, screenId, showTime);
        // console.log("Created show: ", show);
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
        // console.log("Received filter: ", filter);
        const shows = await showService.findShows(filter);
        // const shows = {};
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getShowDetail = async (req, res) => {
    try {
        const { showId } = req.params;
        const showDetail = await showService.getShowDetail(showId);
        res.status(200).json(showDetail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const findShowsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const shows = await showService.findShowsByMovie(movieId);
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getShowSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const shows = await showService.getShowSeats(showId);
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    activateShow,
    createShow,
    findShows,
    findShowsByMovie,
    updatePricing,
    getShowSeats,
    getShowDetail,
};

