const rideModel = require("../models/ride.model");
const mapsService = require("../services/maps.service");
const crypto = require('crypto');

const FARE_CONSTANTS = {
    BASE_RATES: {
        car: 50,    // Base fare in rupees
        auto: 30,
        bike: 20
    },
    PER_KM: {
        car: 12,
        auto: 8,
        bike: 6
    },
    PER_MINUTE: {
        car: 2,
        auto: 1,
        bike: 0.5
    },
    SURGE_MULTIPLIER: {
        car: 1.5,
        auto: 1.3,
        bike: 1.2
    }
};

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    try {
        const distanceTime = await mapsService.getDistanceTime(pickup, destination);
        
        const distanceKm = distanceTime.distance.value / 1000; // Convert meters to kilometers
        const durationMin = distanceTime.duration.value / 60;  // Convert seconds to minutes
        
        // console.log("Distance: " + distanceKm)
        // Calculate fares for each vehicle type
        const fares = Object.keys(FARE_CONSTANTS.BASE_RATES).reduce((acc, vehicle) => {
            // Base calculation
            const baseFare = FARE_CONSTANTS.BASE_RATES[vehicle];
            const distanceFare = distanceKm * FARE_CONSTANTS.PER_KM[vehicle];
            const timeFare = durationMin * FARE_CONSTANTS.PER_MINUTE[vehicle];
            
            // Check peak hours (6-10 AM and 5-9 PM)
            const hour = new Date().getHours();
            const isPeakHour = (hour >= 6 && hour <= 10) || (hour >= 17 && hour <= 21);
            
            // Calculate total fare
            let totalFare = baseFare + distanceFare + timeFare;
            if (isPeakHour) {
                totalFare *= FARE_CONSTANTS.SURGE_MULTIPLIER[vehicle];
            }
            
            acc[vehicle] = Math.round(totalFare);
            return acc;
        }, {});

        return fares;
    } catch (error) {
        throw new Error(`Fare calculation failed: ${error.message}`);
    }
}

function getOtp(num){
    const otp = crypto.randomInt(Math.pow(10,num-1),Math.pow(10,num)).toString();
    return otp;
}

module.exports.createRide = async({user,pickup,destination,vehicleType})=> {
    if(!user || !pickup || !destination || !vehicleType){
        throw new Error('All fields are required');
    }

    
    const fare = await getFare(pickup, destination);

    const ride = rideModel.create({
        user: user,
        pickup: pickup,
        destination: destination,
        vehicleType: vehicleType,
        otp:getOtp(6),
        fare: fare[vehicleType]
    });

    return ride;
};

module.exports.confirmRide = async({rideId,captain}) => {
    if(!rideId){
        throw new Error('Ride ID is required');
    }

    await rideModel.findByIdAndUpdate(rideId, {status: 'accepted',captain: captain._id}, {new: true});

    const ride = await rideModel.findOne({_id:rideId}).populate('user').populate('captain').select('+otp');
    if(!ride){
        throw new Error('Ride not found');
    }

    return ride;
}
module.exports.getFare = getFare;

module.exports.startRide = async({rideId,otp,captain}) => {
    if(!rideId || !otp){
        throw new Error('Ride ID and OTP are required');
    }

    const ride = await rideModel.findOne({_id:rideId},{new:true}).populate('user').populate('captain').select('+otp');
    if(!ride){
        throw new Error('Ride not found');
    }

    if(ride.otp != otp){
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({_id:rideId},{status:'ongoing'});

    return ride;
}

module.exports.endRide = async({rideId,captain}) => {
    if(!rideId){
        throw new Error('Ride ID is required');
    }

    try{
        const ride = await rideModel.findOne({_id:rideId, captain: captain._id}).populate('user').populate('captain').select('+otp');
        if(!ride){
            throw new Error('Ride not found');
        }

        if(ride.status != 'ongoing'){
            throw new Error('Ride is not ongoing');
        }

        await rideModel.findOneAndUpdate({_id:rideId},{status:'completed'});
        return ride;

    }catch(err){
        throw new Error(err.message);
        return ;
    }
}