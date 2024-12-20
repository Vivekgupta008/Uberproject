const express = require('express')
const router = express.Router()
const {body , query} = require('express-validator')
const rideController = require('../controllers/ride.controller')
const authMiiddleware = require("../middlewares/auth.middleware");

router.post('/create',[
    authMiiddleware.authUser,  
    body('pickup').isString().isLength({min:3}).withMessage('Invalid pickup location'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid destination location'),
    body('vehicleType').isString().isIn(['auto','bike','car']).withMessage('Invalid vehicle type')],
    rideController.createRide
)

router.get('/get-fare',authMiiddleware.authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid pickup location'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid destination location'), 
    rideController.getFare)
module.exports = router

router.post('/confirm',authMiiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.post('/start-ride',authMiiddleware.authCaptain,
    rideController.startRide
)

router.post('/end-ride',authMiiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide)