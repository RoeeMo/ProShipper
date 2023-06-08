const Item = require('../models/item');
const { getMessages } = require('../utils/messageUtils');

async function item_table(req, res) {
    try {
        const result = await Item.find().sort({ createdAt: 1 })
        res.render('items', { title: 'Items', username: req.decodedToken.username, items: result });
    } catch (err) {
        console.log(err);
    }
};

async function item_details(req, res) {
    const id = req.params.id;
    try {
        const item = await Item.findById(id);
        const raw_messages = await getMessages(id);
        const sortedMessages = raw_messages.sort((a, b) => b.timestamp - a.timestamp);
        res.render('details', { item: item, messages: sortedMessages, username: req.decodedToken.username, title: `Item Details - ${item.name}` });
    } catch (err) {
        res.status(404).render('404', { title: 'Item not found', username: req.decoded.username });
        console.log(err);
    };
};

async function add_item(req, res) {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json({ success: true, msg: 'Item added successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Something went wrong' });
        console.log(err);
    }
};

async function del_item(req, res) {
    try{
        const itemId = req.body.id;
        await Item.findByIdAndDelete(itemId);
        res.status(200).json({ success: true, msg: 'Item deleted successfully!' });
    } catch {
        console.log(err);
        res.status(500).json({ success: false, msg: 'Something went wrong' });
    }
};

module.exports = {
    item_table,
    item_details,
    add_item,
    del_item
};