const Message = require('../models/message');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getMessages(id) {
    const messages = await Message.find({ item_id: id })
    return(messages);
};

async function socketSetup(server) {
    const io = socketIO(server, { cors: { origin: "*" } });
    
    // Authorization
    io.use((socket, next) => {
        // Get token from socket handshake
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];
        
        // Verify token
        if (token) {
            jwt.verify(token, process.env.TOP_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
                return next(new Error("Authentication error"));
            } else {
                socket.decodedToken = decodedToken;
                socket.username = decodedToken.username;
                socket.item_id = ((socket.request.headers.referer).split("/"))[4];
                return next();
            }
            });
        } else {
          return next(new Error("Authentication error"));
        }
    });
    
    
    await io.on("connection", (socket) => {
        // Handle incoming messages
        socket.on("message", async (data) => {
            try {
                const newMessage = new Message({ text: data, sender: socket.username, item_id: socket.item_id });
                await newMessage.save();
            } catch (err) {
                console.log(err);
            }
        });

        // Broadcast incoming messages
        socket.on("message", (data) => {
            io.emit("message", { message: data, username: socket.username });
          });
    })
};


module.exports = {
    getMessages,
    socketSetup
}