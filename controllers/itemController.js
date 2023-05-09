const Item = require('../models/item');
const { getMessages } = require('../utils/messageUtils');
const { getUsername } = require('../utils/authUtils');

const item_table = (req, res) => {
    Item.find().sort({ createdAt: 1})
    .then((result) => {
        res.render('items', { title: 'Items', items: result });
    })
    .catch((err) => {
        console.log(err);
    });
};

const item_details = async (req, res) => {
    const id = req.params.id;
    try {
        const item = await Item.findById(id);
        const raw_messages = await getMessages(id);
        const sortedMessages = raw_messages.sort((a, b) => b.timestamp - a.timestamp);
        const username = await getUsername(req.cookies.jwt);
        res.render('details', { item: item, messages: sortedMessages, username: username, title: `Item Details - ${item.name}` });
    } catch (err) {
        res.status(404).render('404', { title: 'Item not found' });
        console.log(err);
    };
};

const add_item = (req, res) => {
    const item = new Item(req.body);
    item.save()
        .then((result) => {
            res.status(201).json({ success: true, msg: 'Item added successfully!' });
        })
        .catch((err) => {
            console.log(err);
        });
};

const del_item = (req, res) => {
    const itemId = req.body.id;
    Item.findByIdAndDelete(itemId)
        .then((result) => {
            res.status(200).json({ success: true, msg: 'Item deleted successfully!' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ success: false, msg: 'Something went wrong' });
        });
};

module.exports = {
    item_table,
    item_details,
    add_item,
    del_item
};