const router = require("express").Router();
const Message = require("../models/Message");
const User = require('../models/User');


// Add message
router.post('/', async (req, res) => {
    const { conversationId, sender, recipient, text, isDelivered } = req.body;

    try {
        // Validate required fields
        if (!conversationId || !sender || !text) {
            return res.status(400).json({ error: 'Missing required fields: conversationId, sender, text' });
        }

        // Check if sender ID exists in User collection
        const userExists = await User.exists({ _id: sender });
        if (!userExists) {
            return res.status(400).json({ error: 'Sender ID does not exist' });
        }

        // Create a new message
        const newMessage = new Message({ conversationId, sender, recipient, text, isDelivered });
        await newMessage.save();

        // Populate sender details (username, profileImg)
        await newMessage.populate({
            path: 'sender',
            model: 'User',
            select: 'username profileImg',
        });

        res.status(200).json(newMessage);
    } catch (err) {
        console.error('Error creating message:', err);
        res.status(500).json({ error: 'Server error, failed to create message' });
    }
});


// Get
router.get('/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        }).populate({
            path: 'sender',
            model: 'User',
            select: 'username profileImg',
        });
        res.status(200).json(messages);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;