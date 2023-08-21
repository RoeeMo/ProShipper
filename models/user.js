const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema( {
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    passResetToken: {
        type: String,
        required: false,
        unique: true,
        sparse: true // Allows multiple documents to have null values for the indexed field while still enforcing uniqueness for non-null values
    },
    passResetTokenExpires: {
        type: Number,
        integer: true,
        required: false,
        unique: false
    },
    otpToken: {
        type: String,
        required: false,
        unique: false // Doesn't need to be unique because it can only be accessed with a signed otp JWT
    },
    otpTokenExpires: {
        type: Number,
        integer: true,
        required: false,
        unique: false
    },
    otpTokenTries: {
        type: Number,
        integer: true,
        default: 0,
        required: false,
        unique: false
    },
    type: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;