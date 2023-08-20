const User = require('../models/user');
const { createToken, createUser, passwordVerification } = require('../utils/authUtils');
const { verifyRecaptcha } = require('../utils/generalUtils');
const Bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();


// Globals
const maxAge = 6 * 60 * 60 * 1000; // 6 hours
const passResetTokenLength = 32;
const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: process.env.SEND_GRID_API_KEY,
    },
});

// Controllers
async function signup(req, res) {
    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(req.body.recaptchaResponse);
    if (!recaptchaResult.success) {
        return res.status(400).json({ success: false, msg: 'reCAPTCHA verification failed' });
    }

    const result = await createUser((req.body.username).trim(), (req.body.email).trim(), (req.body.password).trim(), (req.body.password2).trim());
    if (result['success']) {
        const token = createToken(result.newUser._id, result.newUser.type, result.newUser.username);
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: maxAge });
        res.cookie('username', result.newUser.username, { httpOnly: false, sameSite: 'lax', maxAge: maxAge });
        return res.status(201).json({ success: true, msg: 'User created successfully!' });
    } else {
        return res.status(400).json({ success: false, msg: result.errors.join('') });
    }
};

async function login(req, res) {
    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(req.body.recaptchaResponse);
    if (!recaptchaResult.success) {
        return res.status(400).json({ success: false, msg: 'reCAPTCHA verification failed' });
    };

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ success: false, msg: 'Missing parameters' });
    };
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && Bcrypt.compareSync(req.body.password, user.password)) {
            const token = createToken(user.id, user.type, user.username);
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: maxAge });
            return res.status(302).json({ success: true, msg: 'Logged in successfully!' });
        } else {
            return res.status(400).json({ success: false, msg: 'Wrong username or password' });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, msg: 'Something went wrong' });
    }
};

async function changePass(req, res) {
    const errors = passwordVerification(req.body.new_pass, req.body.confirm_pass);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, msg: errors.join('') });
    }
    try {
        const user = await User.findOne({ username: req.decodedToken.username });
        if (user && Bcrypt.compareSync(req.body.current_pass, user.password)) {
            user.password = Bcrypt.hashSync(req.body.new_pass, 10);
            await user.save();
            return res.status(200).json({ success: true, msg: 'Password changed successfully.' });
        } else {
            return res.status(400).json({ success: false, msg: 'Wrong password.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: 'Something went wrong.' });
    }
};

async function forgotPass(req, res){
    try {
        // Verify reCAPTCHA
        const recaptchaResult = await verifyRecaptcha(req.body.recaptchaResponse);
        if (!recaptchaResult.success) {
            return res.status(400).json({ success: false, msg: 'reCAPTCHA verification failed' });
        }
    
        const user = await User.findOne({ email: req.body.email })
        // Always send the same response to block username harvesting attempts
        if (!user) {
            return res.status(200).json({ success: true, msg: 'Password reset email sent, please check your email.' }); //
        } else {
            let passResetToken;
            // Verify the generated token is not assigned to another user already
            while (true) {
                passResetToken = crypto.randomBytes(Math.ceil(passResetTokenLength / 2)).toString('hex'); // each byte is represented by two characters in hexadecimal format, therefore the token's length will be 32
                const token_assign = await User.findOne({ passResetToken: passResetToken });
                if (!token_assign) {
                    break
                }
            }
            const passResetTokenExpires = Date.now() + 3600000 // Token will expire in 1 hour
            user.passResetToken = passResetToken;
            user.passResetTokenExpires = passResetTokenExpires;
            await user.save();
            const mailOptions = {
                from: 'proshipperapp@gmail.com',
                to: user.email,
                subject: 'Hello from ProShipper',
                html: `<p>Hello,</p>
                <p>You have requested to reset your password. Please click the following link to reset your password:</p>
                <a href="${process.env.BASE_URL}/user/reset-pass?resetToken=${passResetToken}">Reset Password</a>
                <p>If you did not request this password reset, please ignore this email.</p>`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error:', error);
                    return res.status(500).json({ success: false, msg: 'Something went wrong on our end, please try again later.' });
                } else {
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ success: true, msg: 'Password reset email sent, please check your email.' });
                }
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: 'Something went wrong on our end, please try again later.' });
    }
};

async function resetPass(req, res){
    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(req.body.recaptchaResponse);
    if (!recaptchaResult.success) {
        return res.status(400).json({ success: false, msg: 'reCAPTCHA verification failed' });
    }

    resetToken = req.body.reset_token;
    // In case someone got to the page not through the email, therefore missing the needed token.
    if (!resetToken || resetToken.length !== passResetTokenLength) { 
        return res.status(400).json({ success: false, msg: 'Are you sure you got here the right way? :)' });
    }
    
    // Verify password before querying the database
    const errors = passwordVerification(req.body.new_pass, req.body.confirm_pass);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, msg: errors.join('') });
    };
    
    try {
        const user = await User.findOne({ passResetToken: resetToken });
        if (user) {
            user.password = Bcrypt.hashSync(req.body.new_pass, 10);
            user.passResetToken = undefined; // Removes the token so it can't be reused
            user.passResetTokenExpires = undefined;
            await user.save();
            return res.status(200).json({ success: true, msg: 'Password changed successfully.' });
        } else {
            return res.status(400).json({ success: false, msg: "Are you sure you got here the right way? :)" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: 'Something went wrong.' });
    }
};

module.exports = {
    login,
    signup,
    changePass,
    forgotPass,
    resetPass
};