const express = require('express');
const authController = require('../controllers/authController');
const { getUsername } = require('../utils/authUtils');
const { requireAuth } = require('../middleware/authMiddleware');


const authRouter = express.Router();

// Signup
authRouter.get('/signup', getUsername, authController.signup_get);
authRouter.post('/signup', authController.signup_post);

// Login
authRouter.get('/login', getUsername, authController.login_get);
authRouter.post('/login', authController.login_post);

// Logout
authRouter.get('/logout', authController.logout_get);

authRouter.get('/user/profile', requireAuth('user'), authController.profile_get);
authRouter.post('/user/change-pass', requireAuth('user'), authController.changePass);
authRouter.post('/user/forgot-pass', authController.forgotPass);
authRouter.get('/user/reset-pass', getUsername, (req, res) => {
    res.render('reset-pass', { title: 'Reset Password', 'username': username });
});
authRouter.post('/user/reset-pass', getUsername, authController.resetPass);


module.exports = authRouter;