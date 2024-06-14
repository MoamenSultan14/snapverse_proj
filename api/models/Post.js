const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        img: {
            type: String
        },
        likes: {
            type: Array,
            default: []
        },
        comments: [
            {
                _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
                postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
                text: String,
                created: { type: Date, default: Date.now },
                likes: { type: Array, default: [] },
            }
        ],
        desc: {
            type: String,
            max: 300
        }
    },
    { timestamps: true }
);




module.exports = mongoose.model("Post", PostSchema);