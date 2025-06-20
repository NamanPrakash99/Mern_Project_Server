const express = require('express');   // Include the express module
const cookieParser = require('cookie-parser'); 
const authRoutes = require('./src/routes/authRoutes'); 
const cors=require('cors');

const app = express();     // Instantiate express app (creating object)

app.use(express.json()); // Middleware to convert json to javascript objects
app.use(cookieParser());

const corsOption = {
    origin: 'http://localhost:5173', 
    credentials: true,
}; 

app.use(cors(corsOption));
app.use('/auth', authRoutes);

const PORT = 5001;
app.listen(5001, (error) => {
    if (error) {
        console.log('Error starting the server:', error);
    } else {
        console.log(`Server is running at http://localhost:${PORT}`);
    }
});