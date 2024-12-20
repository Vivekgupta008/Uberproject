const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
// register user
router.post('/register', [
    body('fullname.firstname')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password') 
        .isLength({ min: 7 })
        .withMessage('Password must be at least 7 characters long')
], userController.registerUser);


// login user   
router.post('/login',[
    body('email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 7 })
        .withMessage('Password must be at least 7 characters long')
], userController.loginUser);
 
// get user profile
router.get('/profile',authMiddleware.authUser ,userController.getUserProfile);

// logout user
router.get('/logout',authMiddleware.authUser, userController.logoutUser);

module.exports = router;
