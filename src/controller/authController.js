const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../model/Users');
const secret = "e36ce1bf-800a-4eeb-8ec4-c960b66ccb46";
const { register } = require('module');
const { response } = require('express');

const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

             // Call Database to fetch user by the email
            const data = await Users.findOne({ email: username });
            if (!data) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = {
                id: data._id,
                name: data.name,
                email: data.email
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });

            res.cookie('jwtToken', token, {
                httpOnly: true,
                secure: false,
                path: '/'
            });

            res.json({ user, message: 'User authenticated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    isUserLoggedIn: (req, res) => {
        const token = req.cookies.jwtToken;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        jwt.verify(token, secret, (error, user) => {
            if (error) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }

            res.json({ message: 'User is logged in', user });
        });
    },

    register: async (req, res) => {
        try {
            //Extract atrributes from request body
            const { username, password, name } = req.body;

            // Firstly check if user already exist with the given email
            const data = await Users.findOne({ email: username });
            if (data) {
                return res.status(401)
                .json({ message: 'Account already exists with the given email' });
            }

            // Encrpyt the password before saving the record to the databse
            const encryptedPassword = await bcrypt.hash(password, 10);
            
            // Create mongoose model object and set to the record values
            const user = new Users({
                email: username,
                password: encryptedPassword,
                name: name
            });

            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
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
