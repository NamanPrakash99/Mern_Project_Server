const jwt = require('jsonwebtoken');

const secret = "e36ce1bf-800a-4eeb-8ec4-c960b66ccb46";

const authController = {
    login: (request, response) => {
        const { username, password } = request.body;

        if (username === 'admin' && password === 'admin') {
            const user = {
                name: 'Naman',
                email: 'naman@2580'
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: false, // true in production with HTTPS
                path: '/'
            });

            response.json({ user, message: 'User authenticated' });
        } else {
            response.status(401).json({ message: 'Invalid credentials' });
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
