const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const { socketSetup } = require("./utils/messageUtils");
require('dotenv').config();


const app = express();

// MongoDB Connection
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then((result) => {
        console.log("Database connected");
        startServer();
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

// Start Server and Socket
function startServer() {
  const server = app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
  socketSetup(server);
}

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