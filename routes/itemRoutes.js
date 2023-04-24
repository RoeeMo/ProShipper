const express = require('express');
const itemController = require('../controllers/itemController')

const itemRouter = express.Router();

itemRouter.get('/items', itemController.item_index);
itemRouter.get('/items/:id', itemController.item_details);
itemRouter.post('/add-item', itemController.add_item);
itemRouter.post('/del-item', itemController.del_item);

module.exports = itemRouter;