const express = require('express');
const itemController = require('../controllers/itemController');
const { requireAuth } = require('../middleware/authMiddleware');

const itemRouter = express.Router();

// Pages
itemRouter.get('/items', requireAuth('user'), itemController.listItems);
itemRouter.get('/items/:id', requireAuth('user'), itemController.viewItem);

// Actions
itemRouter.post('/add-item', requireAuth('admin'), itemController.addItem);
itemRouter.post('/del-item', requireAuth('admin'), itemController.deleteItem);
itemRouter.post('/generate-pdf', requireAuth('user'), itemController.generatePdf);
itemRouter.get('/search', requireAuth('user'), itemController.search);

module.exports = itemRouter;