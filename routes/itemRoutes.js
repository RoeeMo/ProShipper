const express = require('express');
const itemController = require('../controllers/itemController');
const { requireAuth } = require('../middleware/authMiddleware');

const itemRouter = express.Router();

// Pages
itemRouter.get('/items', requireAuth('user'), itemController.listItems);
itemRouter.get('/items/:id', requireAuth('user'), itemController.viewItem);

// Actions
itemRouter.put('/items', requireAuth('admin'), itemController.addItem);
itemRouter.delete('/items/:id', requireAuth('admin'), itemController.deleteItem);
itemRouter.delete('/items/delete-messages/:id', requireAuth('admin'), itemController.deleteMessagesOfItem);
itemRouter.post('/items/generate-pdf', requireAuth('user'), itemController.generatePdf);
itemRouter.get('/search', requireAuth('user'), itemController.search);

module.exports = itemRouter;