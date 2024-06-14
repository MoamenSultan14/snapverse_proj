const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        sender: { type: mongoose.Types.ObjectId, ref: "User" },
        recipient: { type: mongoose.Types.ObjectId, ref: "User" },
        text: {
            type: String,
        },
        isDelivered: { type: Boolean, default: false }
        
    },
    { timestamps: true }
)

module.exports = mongoose.model("Message", MessageSchema);