const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');

const adminRouter = express.Router();


// Pages
adminRouter.get('/admin/users', requireAuth('admin'), adminController.listUsers);
adminRouter.get('/admin/users/:id', requireAuth('admin'), adminController.viewUser);

// Actions
adminRouter.post('/admin/users', requireAuth('admin'), adminController.editUser);
adminRouter.delete('/admin/users', requireAuth('admin'), adminController.deleteUser);


module.exports = adminRouter;