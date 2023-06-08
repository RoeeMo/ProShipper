const express = require('express');
const authController = require('../controllers/authController');
const { getUsername } = require('../utils/authUtils');


const authRouter = express.Router();

// Signup
authRouter.get('/signup', getUsername, authController.signup_get);
authRouter.post('/signup', authController.signup_post);

// Login
authRouter.get('/login', getUsername, authController.login_get);
authRouter.post('/login', authController.login_post);

// Logout
authRouter.get('/logout', authController.logout_get);


module.exports = authRouter;