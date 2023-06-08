const User = require('../models/user');
const {createToken, createUser} = require('../utils/authUtils');
const Bcrypt = require('bcryptjs');
require('dotenv').config();


// Globals
const maxAge = 6 * 60 * 60 * 1000; // 6 hours

// Controllers
function signup_get(req, res) {
    if (username) {
        res.redirect('/items'); // If user logged in, redirect them to the 'items' page
    } else {
        res.render('signup', { title: 'Sign-Up', 'username': username });
    }
};

async function signup_post(req, res) {
    let username = req.body.username;
    const result = await createUser((username).trim(), (req.body.password).trim(), (req.body.password2).trim());
    if (result['success']) {
        const token = createToken(result.newUser._id, result.newUser.type, result.newUser.username);
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: maxAge });
        res.cookie('username', result.newUser.username, { httpOnly: false, sameSite: 'lax', maxAge: maxAge });
        res.status(201).json({ success: true, msg: 'User created successfully!' });
    } else {
        res.status(400).json({ success: false, msg: result.errors.join('') });
    }
};

function login_get(req, res) {
    if (username) {
        res.redirect('/items'); // If user logged in, redirect them to the 'items' page
    } else {
        res.render('login', { title: 'Login', 'username': username });
    }
};

async function login_post(req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ success: false, msg: 'Missing parameters' });
        return
    };
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && Bcrypt.compareSync(req.body.password, user.password)) {
            const token = createToken(user.id, user.type, user.username);
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: maxAge });
            res.status(302).json({ success: true, msg: 'Logged in successfully!' });
        } else {
            res.status(400).json({ success: false, msg: 'Wrong username or password' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, msg: 'Something went wrong' });
    }
};

const logout_get = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, msg: 'Something went wrong' });
    }
}

module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post,
    logout_get
};