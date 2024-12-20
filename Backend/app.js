const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const cors = require('cors');
const userRoutes = require("./routes/user.routes")
const captainRoutes = require("./routes/captain.routes")
const cookieParser = require('cookie-parser');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

connectToDb();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const port = process.env.PORT || 3000;
app.get('/',(req,res)=>{
    res.send('hello ');
})

app.use('/users',userRoutes);
app.use('/captain',captainRoutes);
app.use('/maps',mapsRoutes);
app.use('/rides',rideRoutes);
module.exports = app;
