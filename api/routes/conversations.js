const router = require("express").Router();
const Conversation = require("../models/Conversation");
const User = require('../models/User');

//Create a new conversation
router.post('/', async (req, res) => {
    const { members } = req.body;

    try {
        // Validate members array
        if (!Array.isArray(members) || members.length < 2) {
            return res.status(400).json({ error: 'Members should be an array with at least two user IDs' });
        }

        // Check if all member IDs exist in User collection
        const existingUsers = await User.find({ _id: { $in: members } });
        if (existingUsers.length !== members.length) {
            return res.status(400).json({ error: 'One or more member IDs do not exist' });
        }

        // Create a new conversation
        const newConversation = new Conversation({ members });
        await newConversation.save();

        // Populate username and profileImg for each member
        await newConversation.populate({
            path: 'members',
            model: 'User',
            select: 'username profileImg',
        })

        res.status(200).json(newConversation);
    } catch (err) {
        console.error('Error creating conversation:', err);
        res.status(500).json({ error: 'Server error, failed to create conversation' });
    }
});

module.exports = router;

// Get conversations that inludes userId
router.get('/:userId', async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] },
        })
        .populate({
            path: 'members',
            model: 'User',
            select: 'username profileImg',
        });
        res.status(200).json(conversations);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;