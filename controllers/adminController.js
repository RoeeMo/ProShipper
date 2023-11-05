const User = require('../models/user');

async function listUsers(req, res) {
    const users = await User.find({}).sort({ username: 1});
    res.render('user-management', { title: 'User Management', users: users, 'username': req.decodedToken.username, type:req.decodedToken.type });
};

async function viewUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        res.render('user-details', { title: `User Details - ${user.username}`, user: user, 'username': req.decodedToken.username, type:req.decodedToken.type });
    } catch (err) {
        res.render('404', { title: '404 - Not Found', 'username': req.decodedToken.username, type:req.decodedToken.type })
    }
};

async function editUser(req, res) {
    try {
        const userData = {
            username: req.body.username,
            email: req.body.email,
            type: req.body.type
        }; // Specify the data so malicious users won't be able to modify fields we don't want them to by adding parameters to
        await User.updateOne({ _id: req.body.id }, { $set: userData });
        res.status(200).json({ success: true, msg: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, msg: "something went wrong, please try again later" });
    }
};

async function deleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.body.id)
        if (deletedUser) {
            res.status(202).json({ success: true, msg: 'User deleted successfully' });        
        } else {
            res.status(404).json({ success: false, msg: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Something went wrong, please try again later' });
    }
};


module.exports = {
    listUsers,
    viewUser,
    editUser,
    deleteUser
};