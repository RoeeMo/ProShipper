const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        index: 'text',
        required: true
    },
    price: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        index: 'text',
        required: false
    }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema); /* first argument is a singular of the collection we're trying to access 
                                                    Collection in DB is called items, therefor we'll use Item.          */
module.exports = Item;