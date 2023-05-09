const Message = require('../models/message');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getMessages(id) {
    const messages = await Message.find({ item_id: id })
    return(messages);
};

function socketSetup(server) {
    const io = socketIO(server, { cors: { origin: "*" } });
    
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
    
    io.on("connection", (socket) => {
        socket.on("message", (data) => {
            const newMessage = new Message({ text: data, sender: socket.username, item_id: socket.item_id });
            newMessage.save()
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        })

        socket.on("message", (data) => {
            io.emit("message", { message: data, username: socket.username });
          });
      
        socket.on("typing", (data) => {
            socket.broadcast.emit("typing", data);
          });
      
    })
};


module.exports = {
    getMessages,
    socketSetup
}