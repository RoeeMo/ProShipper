const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();


const app = express();

// MongoDB Connection
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// View Engine
app.set('view engine', 'ejs')

// Middleware & static files
app.use(express.static('./static/'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use(authRoutes);
app.use(itemRoutes);
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
})


// This function must always be the last piece of code
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});