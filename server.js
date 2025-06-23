require('dotenv').config();                          // Load environment variables from .env file
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const mongoose = require('mongoose');



mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB Connected'))
.catch((error)=>console.log(error));

const app = express();       // Instantiate Express application

app.use(express.json());         // Middleware to covert json to javsascript object
app.use(cookieParser());


const corsOption = {
    origin: process.env.CLIENT_ENDPOINT,
    credentials: true,
};

app.use(cors(corsOption));
app.use('/auth', authRoutes);

const PORT=5001
app.listen(5001, (error) => {
    if (error) {
        console.log('Error starting the server:', error);
    } else {
        console.log(`Server is running at http://localhost:${PORT}`);
    }
});
