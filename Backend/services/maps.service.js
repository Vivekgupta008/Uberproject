const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinates = async(address)=>{
    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        if(response.data.status === 'OK'){
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        }else{
            throw new Error('Failed to get address coordinates');
        }
    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports.getDistanceTime = async(origin,destination)=>{
    if(!origin || !destination){
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
    try{
        const response = await axios.get(url);
        if(response.data.status === 'OK'){
            if(response.data.rows[0].elements[0].status === 'ZERO RESULTS'){
                throw new Error('No results found');
            }

            return response.data.rows[0].elements[0];
        }else{
            throw new Error('Failed to get distance and time');
        }
    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports.getSuggestions = async(input) =>{
    if(!input){
        throw new Error('Query is required');
    }

    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        if(response.data.status === 'OK'){
            return response.data.predictions;
        }else{
            throw new Error('Failed to get suggestions');
        }
    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async(ltd,lng,radius)=>{
    const captains = await captainModel.find({
        location:{
            $geoWithin:{
                $centerSphere:[[ltd,lng],radius/6371]
            }
        }
    })

    return captains;
}
