const User = require('../models/user');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = process.env.TOP_SECRET;
const maxAge = 6 * 60 * 60; // 6 hours

function createToken(id, type, username) {
    return jwt.sign({id, type, username}, JWT_SECRET, { expiresIn: maxAge });
};


/* The decision to separate createUser() as a standalone function was made to enhance
   code organization and improve readability, despite its current single-use nature */
async function createUser(username, password, password2) {
    // Reduce DB traffic by checking for errors beforehand
    if (typeof username !== 'string' || typeof password !== 'string' || typeof password2 !== 'string' ||
    !username || !password || !password2) {
        return { success: false, errors: ['Missing or invalid input.'] };
    }
    const errors = passwordVerification(password, password2);
    if (errors.length > 0) {
        return { success: false, errors: errors };
    }
  
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            return { success: false, errors: ['A user has already registered with this username.'] };
        }
        const newUser = new User({
            username: username,
            password: Bcrypt.hashSync(password, 10),
            passResetToken: ''
        });
        await newUser.save();
        return { success: true, newUser: newUser };
    } catch (err) {
        console.log(err.message)
        return { success: false, errors: ['Something went wrong, please try again later'] };
    }
};

function passwordVerification(pass, pass2) {
    const re  = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/;
    const errors = [];

    if (!re.test(pass)) {
        errors.push("Please enter a password that is at least 7 characters long and contains at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).");
    }
    if (pass !== pass2) {
        errors.push("Passwords don't match.");
    }
    return errors;
};

/* For requests that don't require authorization. Any request that require authorization
handles the need for a username with the requireAuth() function that it already uses */
function getUsername(req, res, next) {
    username = '';
    
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                next();
            } else {
                username = decodedToken.username;
                next();
            }
        })
    } else {
        next()
    }
};

module.exports = {
    createToken,
    createUser,
    getUsername,
    passwordVerification
}