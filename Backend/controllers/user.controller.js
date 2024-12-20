const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const blackListTokenSchema = require('../models/blackListToken.model'); 

// create a new user
module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const {fullname,email,password} = req.body;
    const hashPassword = await userModel.hashPassword(password);
    const isUserAlreadyExist = await userModel.findOne({email});

    if(isUserAlreadyExist){
        res.status(400).json({error: 'Captain already exist'});
    }
    const user = await userService.createUser(fullname.firstname,fullname.lastname,email,hashPassword);
    const token = user.generateAuthToken();

    res.status(201).json({token,user});
};

// login user
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const {email,password} = req.body;  
    if(!email || !password) {
        res.status(400).json({error: 'All fields are required'});
    }
    const user = await userModel.findOne({email: email}).select('+password');
        // also give password in the result of the query

    if(!user){
        return res.status(401).json({error: 'Invalid email or password'});
    }
    
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({error: 'Invalid email or password'});
    }

    const token = user.generateAuthToken();
    res.cookie('token',token);
    res.status(200).json({token, user});
}

// get user profile
module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

// logout user
module.exports.logoutUser = async (req, res) => {
    try {
      res.clearCookie('token');
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
