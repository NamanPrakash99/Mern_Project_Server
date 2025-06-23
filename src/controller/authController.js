const jwt = require('jsonwebtoken');

// https://www.uidgenerator.net/
const secret = "e36ce1bf-800a-4eeb-8ec4-c960b66ccb46"

const authController = {
    login: (request, response) => {
        // The body contains the username and password becuase of the express.json()
        // middleware configured in the server.js 
        const { username, password } = request.body;

        if (username === 'admin' && password === 'admin') {
            const user = {
                name: 'Naman',
                email: 'naman@2580'
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({ user: user, message: 'User authenticated' });
        } else {
            response.status(401).json({ message: 'Invalid credentials' });
        }
    },

    isUserLoggedIn: (request, response) => {
        const token = request.cookies.jwtToken;

        if (!token) {
            return response.status(401).json({ message: 'Uauthorized access' });
        }
       

        jwt.verify(token, secret, (error, user) => {
            if (error) {
                return response.status(401).json({ message: 'Uauthorized access' });
            } else {
                response.json({ message: 'User is logged in', user: user });
            }
        });
    },

};

module.exports = authController;