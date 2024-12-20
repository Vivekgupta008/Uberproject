const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapsService = require('../services/maps.service');
const {sendMessageToSocket} = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup,destination,vehicleType} = req.body;
    try{
        const ride = await rideService.createRide({user:req.user._id, pickup, destination, vehicleType});
        res.status(201).json({message: 'Ride created successfully', ride});

        const pickupCoordinates = await mapsService.getAddressCoordinates(pickup);

        const captainsInRadius = await mapsService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
        
        ride.otp = ""

        const rideWithUser = await rideModel.findOne({_id: ride._id}).populate('user');

        captainsInRadius.map(async(captain) =>{
            sendMessageToSocket(captain.socketId, {
                event: 'newRide',
                data: rideWithUser
            });
        })
    }catch(err){
        return res.status(500).json({error: err.message});
    }
}

module.exports.getFare = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const {pickup, destination} = req.query;
    try{
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json({fare});
    }catch(err){
        return res.status(500).json({error: err.message});
    }
}

module.exports.confirmRide = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const {rideId} = req.body;

    try{
        const ride = await rideService.confirmRide({rideId,captain:req.captain});

        sendMessageToSocket(ride.user.socketId, {
            event:'ride-confirmed',
            data:ride
        })

        return res.status(200).json({ride});
    }catch(err){ 
        return res.status(500).json({error: err.message});
    }
}

module.exports.startRide = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const {rideId,otp} = req.body;
    try{
        const ride = await rideService.startRide({rideId, otp,captain:req.captain});

        sendMessageToSocket(ride.user.socketId,{
            event:'ride-started',
            data:ride
        })

        return res.status(200).json({ride});
    }catch(err){
        return res.status(500).json({error: err.message});
    }
};

module.exports.endRide = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const {rideId} = req.body;
    try{
        const ride = await rideService.endRide({rideId, captain:req.captain});

        sendMessageToSocket(ride.user.socketId,{
            event:'ride-ended',
            data:ride
        })
        
    }catch(err){
        return res.status(500).json({error: err.message});
    }
}