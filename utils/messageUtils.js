const { Message,  itemMessage, privateMessage } = require('../models/message.js');
const { getUsernameOrID } = require('../utils/authUtils.js');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getMessages(collection, id1, id2) {
    if (collection === 'item') {
        const messages = await itemMessage.find({ item_id: id1 });
        return messages;
    // Specific chat messages. id1 and id2 represent each side of the conversation
    } else if (id2 && collection === 'private') {
        const messages = await privateMessage.find({
            $or: [
                { $and: [{ recipient: id1 }, { sender: id2 }] },
                { $and: [{ recipient: id2 }, { sender: id1 }] }
            ]
        });
        return messages;
    // Active Chats
    } else if (collection === 'private') {
        const messages = await privateMessage.find({ $or: [{ recipient: id1 }, { sender: id1 }] }); // Get all messages that were sent to/by the user
        return messages;
    }
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
                socket.userID = decodedToken.id;
                socket.recipient = socket.handshake.query.recipient;
                socket.collection = socket.handshake.query.collection;
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
                let newMessage;
                // Determine in which collection the socket's messages should be stored
                if (socket.collection === 'item'){
                    newMessage = new itemMessage({ text: data, sender: socket.userID, item_id: socket.recipient });
                } else if (socket.collection === 'private') {
                    newMessage = new privateMessage({ text: data, sender: socket.userID, recipient: getUsernameOrID(socket.recipient, 'username') }); // The frontend sends the recipient's username and not the recipient's id for security reasons 
                } else {
                    console.log(socket.collection)
                }
                await newMessage.save(); // If the user sends an undefined collection this line throws an error, but the app keeps running
                io.emit("message", { message: data, username: socket.username }); // Broadcast incoming messages
            } catch (err) {
                console.log(err);
            }
        });
    })
};


module.exports = {
    getMessages,
    socketSetup
}