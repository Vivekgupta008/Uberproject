const { validationResult } = require('express-validator');
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenSchema = require('../models/blackListToken.model');

module.exports.registerCaptain = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {fullname, email, password,vehicle} = req.body;
    const isCaptainAlreadyExist = await captainModel.findOne({email});
    
    if(isCaptainAlreadyExist){
        return res.status(400).json({error: 'Captain already exist'});
    }
    const hashPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain(fullname.firstname, fullname.lastname, email, hashPassword, vehicle.color, vehicle.plate, vehicle.capacity, vehicle.type);
    const token = captain.generateAuthToken();

    res.status(201).json({token, captain});
}

module.exports.loginCaptain = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    const captain = await captainModel.findOne({email}).select('+password');
    if(!captain){
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const isPasswordMatch = await captain.comparePassword(password);
    if(!isPasswordMatch){
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({token, captain});
}

module.exports.getCaptainProfile = async(req,res,next) =>{
    res.status(200).json({captain: req.captain});
}

module.exports.logoutCaptain = async(req,res,next) =>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    await blackListTokenSchema.create({token});
    
    res.clearCookie('token');
    res.status(200).json({message:"Logged out successfully"});
}
