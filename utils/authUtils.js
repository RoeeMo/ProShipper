const User = require('../models/user');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.TOP_SECRET;
const maxAge = 3 * 24 * 60 * 60; // 3 days

async function createToken(id) {
    return jwt.sign({id}, JWT_SECRET, { expiresIn: maxAge });
};

async function createUser(username, password, password2) {
    const re  = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/;
    const errors = [];
    
    // Reduce DB traffic by checking for errors beforehand
    if (typeof username !== 'string' || typeof password !== 'string' || typeof password2 !== 'string' ||
    !username.trim() || !password.trim() || !password2.trim()) {
        return { success: false, errors: ['Missing or invalid input.'] };
    }
    if (!re.test(password)) {
      errors.push("Please enter a password that is at least 7 characters long and contains at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).");
    }
    if (password !== password2) {
      errors.push("Passwords don't match.");
    }
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
        });
        await newUser.save();
        return { success: true, newUser: newUser };
    } catch (err) {
        console.log(err.message)
        return { success: false, errors: ['Something went wrong, please try again later'] };
    }
};




module.exports = {
    createToken,
    createUser
}