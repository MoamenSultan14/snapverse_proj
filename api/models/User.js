const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            min:4,
            max:20,
            unique: true,
            required: true
        },
        email:{
            type: String,
            max:50,
            unique: true,
            required: true
        },
        password: {
            type: String,
            min: 8,
            require: true
        },
        profileImg: {
            type:String,
            default: ""
        },
        posts:{
            type: Number
        },
        followings: {
            type: Array,
            default: []
        },
        followers: {
            type: Array,
            default: []
        },
        desc: {
            type: String,
            max:150
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }
)

module.exports = mongoose.model("User", UserSchema);