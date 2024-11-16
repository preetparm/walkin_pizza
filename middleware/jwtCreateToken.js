const jwt = require('jsonwebtoken'); // Make sure you have required jwt at the top of your file

const createToken = (user) => {
    try {
        if (!user) {
            return { error: 'Authentication failed' }; // Return error object
        }

        const token = jwt.sign({ userId: user.username }, 'your-secret-key', {
            expiresIn: '1h',
        });
        return { token }; // Return the token
    } catch (error) {
        return { error: 'Login failed' }; // Return error object
    }
};
module.exports =createToken;