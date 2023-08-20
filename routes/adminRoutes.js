const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');

const adminRouter = express.Router();

adminRouter.get('/admin/users', requireAuth('admin'), adminController.listUsers);
adminRouter.delete('/admin/users', requireAuth('admin'), adminController.deleteUser);
adminRouter.get('/admin/users/:id', requireAuth('admin'), adminController.viewUser);
adminRouter.post('/admin/users', requireAuth('admin'), adminController.editUser);


module.exports = adminRouter;