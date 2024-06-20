const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
require("../models/Img")
const Img = mongoose.model("Img")
// const jwt = require('jsonwebtoken');

// Create a post
router.post("/", async (req,res) => {
    console.log("from create post")
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(e) {
        res.status(500).json(e);
    }
});

// Update a post
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (e) {
      res.status(500).json(e);
    }
});

// Delete a post
router.delete("/:id", async (req,res) => {
    try{
        const postToDelete = await Post.findById(req.params.id);
        if(postToDelete.userId === req.body.userId){
            await postToDelete.deleteOne()
            res.status(200).json("the post has been deleted");
        } else{
            res.status(403).json("you can delete only your post");
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Like/Dislike a post
router.put("/:id/like", async (req,res) => {
    try{
        const postToLike = await Post.findById(req.params.id);
        if(!postToLike.likes.includes(req.body.userId)){
            await postToLike.updateOne({ $push: { likes: req.body.userId }});
            res.status(200).json("the post has been liked")
        } else {
            await postToLike.updateOne({ $pull: { likes: req.body.userId}});
            res.status(200).json("the post has been disliked")
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

// Find a post by ID
router.get('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Liking/Disliking a comment
router.put('/:postId/comments/:commentId/like', async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = req.body;

  try {

      const post = await Post.findById(postId);
      console.log(post)
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Find the comment by its ID
      const comment = post.comments.find(comment => comment._id.toString() === commentId);
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      // Check if the user has already liked the comment
      const alreadyLikedIndex = comment.likes.findIndex(likeUserId => likeUserId.toString() === userId);
      if (alreadyLikedIndex !== -1) {
          // If the user has already liked the comment, remove the like (dislike)
          comment.likes.splice(alreadyLikedIndex, 1);
      } else {
          // If the user has not liked the comment yet, add the like
          comment.likes.push(userId);
      }

      await post.save();

      res.status(200).json(comment);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Get feed posts
router.get("/feed/:userId", async (req, res) => {
  try {

    const currentUser = await User.findById(req.params.userId);
    // Find posts by the current user
    const userPosts = await Post.find({ userId: currentUser._id }).populate({
      path: 'comments.postedBy',
      model: 'User',
      select: 'username profileImg'

    });

    // Find posts by the current user's friends
    const friendPosts = await Promise.all(
      currentUser.followings.map(async (friendId) => {
        const posts = await Post.find({ userId: friendId }).populate({
          path: 'comments.postedBy',
          model: 'User',
          select: 'username profileImg'
        });
        return posts;
      })
    );

    // Concatenate userPosts and friendPosts and flatten the array
    const allPosts = userPosts.concat(...friendPosts);

    res.status(200).json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get user posts
router.get("/profile/:username", async (req,res) => {
  res.status(200)
  try{
    const user = await User.findOne({username: req.params.username});
    const userPosts = await Post.find({userId: user._id});
    res.status(200).json(userPosts);
  } catch(e) {
    res.status(500).json(e);
  }
});


// Upload img to the DB (TEST)
router.post("/uploadImg", async (req,res) => {
  try{
    const {base64} = req.body;
    Img.create({imageUrl:base64})
    res.status(200).json("Img got uploaded to the DB")
    
  } catch(e) {

    res.status(500).json(e)
  }
})

// Get updated post comments
router.get("/comments/:postId", async (req,res) => {
  try{
    const post = await Post.findById(req.params.postId).populate({
      path: 'comments.postedBy',
      model: 'User',
      select: 'username profileImg'

    });
    res.status(200).json(post.comments)

  }catch(e)
  {
    res.status(500).json(e)
  }
})

// Post a comment
router.post("/comment/:postId", async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.body.userId
    };

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: comment } },
      { new: true }
    ).populate({
      path: 'comments.postedBy',
      model: 'User',
      select: 'username profileImg'

    });

    res.status(200).json(updatedPost);
  }catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Delete a comment
// const authenticateToken = (req, res, next) => {
//   // Extract the token from the Authorization header
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.sendStatus(401); // No token provided

//   // Verify the token
//   jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
//     if (err) return res.sendStatus(403); // Invalid token

//     // Find the user in the database (assuming the token contains user ID)
//     req.user = await User.findById(user.id);
//     if (!req.user) return res.sendStatus(404); // User not found

//     // Proceed to the next middleware or route handler
//     next();
//   });
// };

// router.delete('/commentDelete/:postId/:commentId', async (req, res) => {
//   try {
//     console.log(req.body.test)
//     const postId = req.params.postId;
//     const commentId = req.params.commentId;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).send({ error: 'Post not found' });
//     }


//     const comment = post.comments.id(commentId);
//     if (!comment) {
//       return res.status(404).send({ error: 'Comment not found' });
//     }


//     console.log("comment.postedBy", comment.postedBy)
//     console.log("comment.postedBy.toString()", comment.postedBy.toString())
//     console.log("req.body.userId", req.body.userId)
//     console.log("req.body.userId.toString()", req.body.userId.toString())


//     // Check if the current user is the one who posted the comment
//     if (comment.postedBy.toString() !== req.body.userId.toString()) {
//       return res.status(403).send({ error: 'User not authorized to delete this comment' });
//     }
   

//     // Remove the comment
//     comment.remove();
 
//     await post.save();

//     res.status(200).send({ message: 'Comment deleted successfully' });
//   }catch (error) {
//     res.status(500).send({ error: 'Internal server error' });
//   }
// });

// Delete a comment
router.delete('/commentDelete/:postId/:commentId', async (req, res) => {
  try {
      const userId = req.query.userId;
      const postId = req.params.postId;
      const commentId = req.params.commentId;

      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).send({ error: 'Post not found' });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
          return res.status(404).send({ error: 'Comment not found' });
      }
      if (comment.postedBy.toString() !== userId) {
          return res.status(403).send({ error: 'User not authorized to delete this comment' });
      }

      post.comments.pull({ _id: commentId });

      await post.save();
      res.status(200).send({ message: 'Comment deleted successfully' });
  } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
  }
});


module.exports = router;