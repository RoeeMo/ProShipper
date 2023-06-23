const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const { socketSetup } = require("./utils/messageUtils");
const { getUsername } = require('./utils/authUtils');
require('dotenv').config();


const app = express();

// MongoDB Connection
const dbURI = process.env.MONGO_URI;
try {
    mongoose.connect(dbURI);
    console.log("Database connected");
    startServer();
} catch (err) {
    console.log(err);
    process.exit(1);
};

// Start Server and Socket
function startServer() {
  const server = app.listen(3000, () => {
    console.log(`Server running on ${process.env.BASE_URL}`);
  });
  socketSetup(server);
}

// View Engine
app.set('view engine', 'ejs');

// Middleware & static files
app.use(express.static('./static/'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use(authRoutes);
app.use(itemRoutes);
app.get('/', getUsername, (req, res) => {
    res.render('index', { title: 'Home', 'username': username });
})


// This function must always be the last piece of code
app.use(getUsername, (req, res) => {
    res.status(404).render('404', { title: '404', 'username': username });
});