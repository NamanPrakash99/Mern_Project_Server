const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS config for frontend at localhost:5173
const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOption));

// Routes
app.use('/auth', authRoutes);

// Server start
app.listen(PORT, (error) => {
    if (error) {
        console.log('Error starting the server:', error);
    } else {
        console.log(`Server is running at http://localhost:${PORT}`);
    }
});
