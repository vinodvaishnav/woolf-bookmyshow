const express = require('express');

const { getRegions } = require('../controllers/regionController');

const regionRouter = express.Router();

regionRouter.get('/', getRegions);

module.exports = regionRouter;