const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Assuming you're using cookies to store the token

    // Check if the token is provided
    if (!token) {
        return res.redirect('/login'); 
    }

    // Verify the token
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.redirect('/login'); 
        }

        console.log("User is authorized from validation", decoded);
        
        // Attach the decoded user info (including user ID) to the request object
        req.user = { userId: decoded.userId, email: decoded.email }; // Adjust based on your token payload
        
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = verifyToken;

