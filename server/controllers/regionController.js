const regionModel = require('../models/regionModel');

const getRegions = async (req, res) => {
    try {
        const regions = await regionModel.find();
        res.status(200).json(regions);
    } catch (error) {
        console.error('Error fetching regions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getRegions
}