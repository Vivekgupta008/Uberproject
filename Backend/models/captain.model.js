const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type : String,
            required : true,
            minlength : [3,'first name must be at least 3 characters long']
        },
        lastname:{
            type : String,
            minlength : [3,'last name must be at least 3 characters long']
        }
    },
    email:{
        type : String,
        required : true,
        unique : true,
        minlength : [5,'email must be at least 5 characters long'],
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password:{
        type : String,
        required : true,
        select: false
    },
    socketId:{
        type : String
    },
    status :{
        type:String,
        enum:['available','busy'],
        default:'busy'
    },
    vehicle:{
        color:{
            type : String,
            required : true,
            minlength : [3,'color must be at least 3 characters long']
        },
        plate:{
            type : String,
            required : true,
            minlength : [4,'plate number must be at least 4 characters long']
        },
        capacity:{
            type : Number,
            required : true,
            min:[1,'capacity must be at least 1 person']
        },
        type:{
            type : String,
            required : true,
            enum:['car','bike','auto']
        }
    },
    location:{
        ltd:{
            type : Number,
        },
        lng:{
            type : Number,
        }
    }
});

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id : this._id}, process.env.JWT_SECRET,{expiresIn: '24h'})
    return token;
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('captain',captainSchema);
module.exports = captainModel;