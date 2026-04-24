const theaterService = require('../services/theater.service');

const getTheaters = async (req, res) => {
    try {
        const theaters = await theaterService.getTheaters();
        res.send(theaters);
    } catch (error) {
        console.error('Error fetching theaters:', error);
        res.status(500).send({ message: 'Error fetching theaters' });
    }
}

const getTheaterDetail = async (req, res) => {
    try {
        const theaterId = req.params.theaterId;
        const theater = await theaterService.getTheaterDetail(theaterId);
        if (!theater) {
            return res.status(404).send({ message: 'Theater not found' });
        }
        res.send(theater);
    } catch (error) {
        console.error('Error fetching theater details:', error);
        res.status(500).send({ message: 'Error fetching theater details' });
    }
}

const addTheater = async (req, res) => {
    try {
        const theaterData = req.body;
        const newTheater = await theaterService.addTheater(theaterData);
        res.status(201).send({
            message: `Theater: ${newTheater.name} - Added successfully`,
            data: newTheater
        });
    } catch (error) {
        console.error('Error adding theater:', error);
        res.status(500).send({ message: 'Error adding theater' });
    }
}

const updateTheater = async (req, res) => {
    try {
        const theaterId = req.params.theaterId;
        const updateData = req.body;

        const updatedTheater = await theaterService.updateTheater(theaterId, updateData);
        if (!updatedTheater) {
            return res.status(404).send({ message: 'Theater not found' });
        }

        res.send({
            message: `Theater: ${updatedTheater.name} - Updated successfully`,
            data: updatedTheater
        });
    } catch (error) {
        console.error('Error updating theater:', error);
        res.status(500).send({ message: 'Error updating theater' });
    }
}

const deleteTheater = async (req, res) => {
    try {
        const theaterId = req.params.theaterId;

        const result = await theaterService.deleteTheater(theaterId);
        if (!result) {
            return res.status(404).send({ message: 'Theater not found' });
        }

        res.send({ message: `Theater deleted successfully` });
    } catch (error) {
        console.error('Error deleting theater:', error);
        res.status(500).send({ message: 'Error deleting theater' });
    }
}

const toggleTheaterStatus = async (req, res) => {
    try {
        const theaterId = req.params.theaterId;

        const updatedTheater = await theaterService.toggleTheaterStatus(theaterId);
        if (!updatedTheater) {
            return res.status(404).send({ message: 'Theater not found' });
        }

        res.send({
            message: `Theater status updated to ${updatedTheater.status}`,
            data: updatedTheater
        });
    } catch (error) {
        console.error('Error toggling theater status:', error);
        res.status(500).send({ message: 'Error toggling theater status' });
    }
}

module.exports = {
    getTheaters,
    getTheaterDetail,
    addTheater,
    updateTheater,
    deleteTheater,
    toggleTheaterStatus
}