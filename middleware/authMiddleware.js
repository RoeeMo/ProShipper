const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.TOP_SECRET;

function requireAuth(type='user') {
    return function(req, res, next) {
        const token = req.cookies.jwt;

        if (token) {
            jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/login');
                } else {
                    if (decodedToken.type == type || decodedToken.type == 'admin') {
                        req.decodedToken = decodedToken;
                        next();
                    } else {
                        res.status(401).json({ success: false, msg: 'Not enough permissions' });
                    }
                }
            })
        } else {
            res.redirect('/login');
        }
    }
};

module.exports = {
    requireAuth
};