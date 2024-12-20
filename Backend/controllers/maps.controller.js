const mapsService = require('../services/maps.service');
const {validationResult} = require('express-validator');
 
module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const {address} = req.query;

    try {
        const coordinates = await mapsService.getAddressCoordinates(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    
    try{
        const {origin, destination} = req.query;
        const distanceTime = await mapsService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to calculate distance and time' });
    }
}

module.exports.getSuggestions = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    try{
        const {input} = req.query;
        const suggestions = await mapsService.getSuggestions(input);
        res.status(200).json(suggestions);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to get suggestions' });
    }
}