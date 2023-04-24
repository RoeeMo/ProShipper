const Item = require('../models/item');

const item_index = (req, res) => {
    Item.find().sort({ createdAt: 1})
    .then((result) => {
        res.render('items', { title: 'Items', items: result });
    })
    .catch((err) => {
        console.log(err);
    });
}

const item_details = (req, res) => {
    const id = req.params.id;
    Item.findById(id)
        .then(result => {
            res.render('details', { item: result, title: 'Item Details - ' })
        })
        .catch(err => {
            res.status(404).render('404', { title: 'Item not found' });
        });
}

const add_item = (req, res) => {
    const item = new Item(req.body);
    item.save()
        .then((result) => {
            res.redirect('/items');
        })
        .catch((err) => {
            console.log(err);
        });
}

const del_item = (req, res) => {
    const itemId = req.body.id;
    Item.findByIdAndDelete(itemId)
        .then((result) => {
            res.redirect('/items')
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error deleting the item');
        });
}

module.exports = {
    item_index,
    item_details,
    add_item,
    del_item
}