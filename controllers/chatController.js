const { getMessages } = require('../utils/messageUtils');
const { getUsernameOrID } = require('../utils/authUtils.js');

// Get main chat page
async function main_chat(req, res) {
    try {
        const activeChatsMessages = await getMessages('private', req.decodedToken.id);
        // Extract unique recipients' and senders' IDs to present in "active chats" sidebar
        const uniqueIds = [...new Set((activeChatsMessages.map(message => message.recipient)).concat(activeChatsMessages.map(message => message.sender)))];
        // Remove the user own ID from the array
        const filteredIds = uniqueIds.filter(id => id !== req.decodedToken.id);
        // Convert IDs to usernames
        const activeChatUsernames = await Promise.all(filteredIds.map(async (id) => {
            return await getUsernameOrID(id, 'id')
        }));
        
        res.render('chat', { title: 'Home', username: req.decodedToken.username, active_chats_usernames: activeChatUsernames });
    } catch (err) {
        res.status(404).render('404', { title: 'Oops!', username: req.decodedToken.username });
        console.log(err);
    };
};

// Get specific chat page
async function get_chat(req, res) {
    try {
        messages = await getMessages(collection='private', id1=await getUsernameOrID(req.body.username, 'username'), id2=req.decodedToken.id);
        console.log(messages);
        await Promise.all(messages.map(async (message) => {
            if (message.sender === req.decodedToken.id) {
                message.sender = req.decodedToken.username;
                message.recipient = req.body.username;
            } else {
                message.sender = req.body.username;
                message.recipient = req.decodedToken.usernamereq.body.username;
            }
        }));
        res.status(200).json({messages: messages});
    } catch (err) {
        console.log(err)
    }
};


module.exports = {
    main_chat,
    get_chat
};