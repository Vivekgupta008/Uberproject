const express = require('express');
const router = express.Router();

const captainController = require('../controllers/captain.controller');
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/register',[
    body('fullname').isLength({min: 3}).withMessage('Fullname must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({min: 3}).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.capacity').isLength({min: 1}).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.type').isIn(['car','auto','bike']).withMessage('Invalid vehicle type')],
    captainController.registerCaptain
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], captainController.loginCaptain)

router.get('/profile',authMiddleware.authCaptain,captainController.getCaptainProfile)

router.get('/logout', authMiddleware.authCaptain,captainController.logoutCaptain)

module.exports = router;