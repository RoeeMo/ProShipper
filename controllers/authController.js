const User = require('../models/user');
const {createToken, createUser} = require('../utils/authUtils')
const jwt = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');
require('dotenv').config();

// Globals
const maxAge = 3 * 24 * 60 * 60; // 3 days

// Controllers
const signup_get = (req, res) => {
    res.render('signup', { title: 'Sign-Up', errs: '' });
};

const signup_post = async (req, res) => {
    let username = req.body.username;
    const result = await createUser((username).trim(), (req.body.password).trim(), (req.body.password2).trim());
    if (result['success']) {
        const token = await createToken(result.newUser._id);
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: maxAge });
        res.status(201).json({ success: true });
    } else {
        res.status(400).json({ success: false, errs: result.errors.join('') });
    }
};

const login_get = (req, res) => {
    res.render('login', { title: 'Login', errs: '' });
};

const login_post = (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ success: false, errs: 'Missing parameters' });
        return
    };
    User.findOne({ username: req.body.username })
        .then( async (user) => {
            if (user && Bcrypt.compareSync(req.body.password, user.password)) {
                const token = await createToken(user.id);
                res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: maxAge });
                res.status(302).json({ success: true, token: token });
            } else {
                res.status(400).json({ success: false, errs: 'Wrong username or password' });
            }
        })
};


module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post
};