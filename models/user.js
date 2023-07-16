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
        unique: false // The value is unique for each user, but defining it in the DB will cause an error when the value is set to null
    },
    passResetTokenExpires: {
        type: Number,
        integer: true,
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