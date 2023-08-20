const express = require('express');
const authController = require('../controllers/authController');
const { getUsername } = require('../utils/authUtils');
const { requireAuth } = require('../middleware/authMiddleware');


const authRouter = express.Router();

// Signup
authRouter.get('/signup', getUsername, (req, res) => {
    // If user logged in, redirect them to the 'items' page
    if (username) {
        return res.redirect('/items'); 
    } else {
        return res.render('signup', { title: 'Sign-Up', 'username': username, type:'' }); 
    }
});
authRouter.post('/signup', authController.signup);

// Login
authRouter.get('/login', getUsername, (req, res) => {
    // If user logged in, redirect them to the 'items' page
    if (username) {
        return res.redirect('/items');
    } else {
        return res.render('login', { title: 'Login', 'username': username, type: '' });
    }
});
authRouter.post('/login', authController.login);

// Logout
authRouter.get('/logout', (req, res) => {
    try {
        res.clearCookie('jwt');
        return res.redirect('/');
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, msg: 'Something went wrong' });
    }
});

// User
authRouter.get('/user', requireAuth('user'), (req, res) => {
    res.render('profile', { username: req.decodedToken.username, type:req.decodedToken.type, title: 'Profile' });
});
authRouter.post('/user/change-pass', requireAuth('user'), authController.changePass);

// Forgot Password
authRouter.post('/user/forgot-pass', authController.forgotPass);
authRouter.post('/user/reset-pass', authController.resetPass);
authRouter.get('/user/reset-pass', (req, res) => {
    res.render('reset-pass', { title: 'Reset Password', 'username': username, type:'' });
});


module.exports = authRouter;