const express = require('express');
const chatController = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');

const chatRouter = express.Router();

// Pages
chatRouter.get('/chat', requireAuth('user'), chatController.main_chat);
chatRouter.post('/chat/initiate', requireAuth('user'), chatController.get_chat);

module.exports = chatRouter;