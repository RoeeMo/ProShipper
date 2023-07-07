const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    item_id: {
        type: String,
        required: true
    }
}, { timestamps: true });

const itemMessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    item_id: {
        type: String,
        required: true
    }
}, { timestamps: true, collection: 'item_messages' });

const privateMessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    }
}, { timestamps: true, collection: 'private_messages' });

const itemMessage = mongoose.model('ItemMessage', itemMessageSchema);
const privateMessage = mongoose.model('PrivateMessage', privateMessageSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {
    itemMessage,
    privateMessage,
    Message
};