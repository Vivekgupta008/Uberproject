const captainModel = require('../models/captain.model');

module.exports.createCaptain = async(firstname,lastname,email,password,color,plate,capacity,type,)=>{
    if(!firstname || !lastname || !email || !password || !color || !plate || !capacity || !type){
        throw new Error('All fields are required');
    }

    const captain = await captainModel.create({
        fullname:{
            firstname: firstname,
            lastname: lastname
        },
        email: email,
        password: password,
        vehicle:{
            color,
            plate,
            capacity,
            type
        }

    });
    return captain;
}   