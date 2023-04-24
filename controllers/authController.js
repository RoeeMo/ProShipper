const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');
require('dotenv').config();

const JWT_SECRET = process.env.TOP_SECRET;

const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (id) => {
    return jwt.sign(
        { id },
        JWT_SECRET,
        { expiresIn: maxAge }
    );
}

const signup_get = (req, res) => {
    res.render('signup', { title: 'Sign Up', errs: '' });
};

const signup_post = (req, res) => {
    const re  = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/;
    const msgArr = [];
    if (!req.body.username || !req.body.password || !req.body.password2) {
        msgArr.push("Missing username or password.");
    };
    if (!re.test(req.body.password)) {
        msgArr.push("Please enter a password that is at least 7 characters long and contains at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).");
    };
    if (req.body.password != req.body.password2) {
        msgArr.push("Passwords don't match.");
    };
    if (msgArr.length > 0) {
        const msg = msgArr.join('');
        res.render('signup', { title: 'Sign Up', errs: msg });
    } else {
        User.findOne({ username: req.body.username }).then((user) => {
            if (user) {
                msgArr.push("A user has already registered with this username.");
                res.render('SignUp', { title: 'Sign Up', errs: msgArr });
            } else {
                const newUser = new User({
                    username: req.body.username,
                    password: Bcrypt.hashSync(req.body.password, 10)
                });
                newUser.save();
                const token = createToken(newUser._id);
                res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: maxAge });
                res.status(201).json({ user: newUser._id })
            }
        });
    }
}

const login_get = (req, res) => {
    res.render('login', { title: 'Login' });
}

const login_post = (req, res) => {
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, error: "Missing parameters" });
        return
    }
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user && Bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ id: user._id, username: user.username}, JWT_SECRET);
                res.json({ success: true, token: token });
            } else {
                res.json({ success: false, error: "Wrong username or password" });
            }
        })
}


module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post
}