const router = require("express").Router();
const User = require("../models/User");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const ObjectId = require('mongoose').Types.ObjectId;


// Get all users
router.get("/all", async (req, res) => {
    try {
        const { username } = req.query;
        let users;
        
        if (username) {
            users = await User.find({ username: { $regex: new RegExp(username, 'i') } });
        } else {
            users = await User.find();
        }

        // Remove sensitive data from each user before sending the response
        const userArray = users.map(user => {
            const { password, ...other } = user._doc;
            return other;
        });

        res.status(200).json(userArray);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update user
router.put("/:id", async (req,res) => {
    try{
        if(req.body.userId === req.params.id || req.body.isAdmin){
            if(req.body.password){
                const salt = await bcrypt.genSalt();
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set: req.body})
            res.status(200).json(updatedUser)
        }else{
            res.status(404).json("you can update only your account")
        }
    } catch(e) {
        res.status(500).json(e)
    }
})
// Delete a user
router.delete("/:id", async (req,res) => {
    try{
        if(req.body.userId === req.params.id || req.body.isAdmin){
            await User.findOneAndDelete(req.params.id,{$set: req.body})
            res.status(200).json("user has been deleted")
        }else{
            res.status(404).json("you can delete only your account")
        }
    } catch(e) {
        res.status(500).json(e)
    }
})

// Get user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get("/:id", async (req,res) =>{
    try{

        const user = await User.findById(req.params.id);
        res.status(200).json(user);

    } catch(err){
        res.status(500).json(err);
    }
});

// Follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (e) {
        res.status(500).json(e);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
});

// Unfollow
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You are not following this user");
            }
        } catch (e) {
            res.status(500).json(e);
        }
    } else {
        res.status(403).json("You can't unfollow yourself");
    }
});


// Get followings
router.get("/:id/followings", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followings = await Promise.all(
            user.followings.map(async (followingId) => {
                const followingUser = await User.findById(followingId, 'username profileImg');
                return followingUser;
            })
        );

        res.status(200).json(followings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Suggest users
router.get("/suggestMutualFriends/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {

        const user = await User.findById(userId);
        const commonFollowings = user.followings;

        // Find Followers of Followings and Count Mutual Friends
        let mutualFriendsCount = {}; // Object to store count of mutual friends
        for (let followingId of commonFollowings) {
            const followingUser = await User.findById(followingId);
            for (let followerId of followingUser.followers) {
                // Filter Out Existing Connections
                if (!user.followings.includes(followerId) && followerId !== userId && followerId !== followingUser._id) {
                    if (mutualFriendsCount[followerId]) {
                        mutualFriendsCount[followerId]++;
                    } else {
                        mutualFriendsCount[followerId] = 1;
                    }
                }
            }
        }

        // Sort Mutual Friends by Number of Mutual Connections
        let sortedMutualFriends = Object.keys(mutualFriendsCount).sort((a, b) => mutualFriendsCount[b] - mutualFriendsCount[a]);

        // Retrieve User Objects for Suggested Mutual Friends
        let suggestedMutualFriends = await Promise.all(sortedMutualFriends.map(async (friendId) => {
            const friend = await User.findById(friendId);
            return friend.toObject();
        }));

        // If suggested mutual friends are less than 5, fill with random users
        if (suggestedMutualFriends.length < 5) {
            const additionalRandomUsersCount = 5 - suggestedMutualFriends.length;


            const randomUsers = await User.aggregate([
                { $match: { _id: { $ne: new ObjectId(userId)} } }, // Exclude current user
                { $match: { _id: { $nin: commonFollowings.map(id => new ObjectId(id)) } } }, // Exclude common followings
                { $match: { _id: { $nin: suggestedMutualFriends.map(doc => doc._id) } } }, // Exclude current user's followers
                { $sample: { size: additionalRandomUsersCount } } // Randomly select 'count' users
            ]);

            suggestedMutualFriends = [...suggestedMutualFriends, ...randomUsers];
        }

        // Return suggested mutual friends along with the first five
        res.json({ 
            firstFiveMutualFriends: suggestedMutualFriends.slice(0, 5),
            allMutualFriends: suggestedMutualFriends
        });
    } catch (error) {
        console.error("Error suggesting mutual friends:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
