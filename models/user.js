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
    type: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;