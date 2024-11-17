const express = require("express");
const path = require("path"); // Require the path module
const app = express();
const port = 3000;
const user=require('./users');
const cookieParser = require('cookie-parser');


const languageRouter=require("./routes/languageRouter")
const {uselogin,useloginPost} = require ("./middleware/userLogin");
const verifyToken = require("./middleware/jwtValidate");



// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(cookieParser());

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'))

/// Define routes that don't require token verification first
// app.post('/signup', languageRouter); 
// app.get('/signup', (req, res) => res.render('signup'));// Signup route without token check
app.get('/login', (req, res) => res.render('login')); // Login page
app.post('/login',languageRouter); // Login POST

// Apply `verifyToken` for all other routes starting with '/'
app.use('/', verifyToken, languageRouter);

// Error-handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
});

// Start the server
app.listen(port, () => {
    console.log(`I am running at the localhost port of ${port}`);
});
