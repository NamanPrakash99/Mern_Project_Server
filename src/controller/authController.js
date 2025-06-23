const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../model/Users');

const secret = "e36ce1bf-800a-4eeb-8ec4-c960b66ccb46";

const authController = {
    login: async(request, response) => {
        try {
            const { username, password } = request.body;

            // Call Database to fetch user by the email
            const data = await Users.findOne({ email: username });
            if (!data) {
                return response.status(401).json({ message: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const user = {
                id: data._id,
                name: data.name,
                email: data.email
            };


            const token = jwt.sign(user, secret, { expiresIn: '1h' });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: false, // true in production with HTTPS
                path: '/'
            });

            response.json({ user, message: 'User authenticated' });
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },


    isUserLoggedIn: (request, response) => {
        const token = request.cookies.jwtToken;

        if (!token) {
            return response.status(401).json({ message: 'Unauthorized access' });
        }

        jwt.verify(token, secret, (error, user) => {
            if (error) {
                return response.status(401).json({ message: 'Unauthorized access' });
            }

            response.json({ message: 'User is logged in', user });
        });
    },

    logout: (req, res) => {
        res.clearCookie('jwtToken', {
            httpOnly: true,
            secure: false,
            path: '/'
        });
        res.json({ message: 'Logged out successfully' });
    }
};

module.exports = authController;
