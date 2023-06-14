const express = require('express');
const itemController = require('../controllers/itemController');
const { requireAuth } = require('../middleware/authMiddleware');

const itemRouter = express.Router();

// Pages
itemRouter.get('/items', requireAuth('user'), itemController.item_table);
itemRouter.get('/items/:id', requireAuth('user'), itemController.item_details);

// Actions
itemRouter.post('/add-item', requireAuth('admin'), itemController.add_item);
itemRouter.post('/del-item', requireAuth('admin'), itemController.del_item);
itemRouter.post('/generate-pdf', requireAuth('user'), itemController.generate_pdf);
itemRouter.get('/search', requireAuth('user'), itemController.search);

module.exports = itemRouter;