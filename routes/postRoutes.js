const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");

const router = express.Router();

// Create post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user.id,
      content: req.body.content,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
});

// Get global feed
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// Like / Unlike a post
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    // Convert ObjectIds to strings before comparing
    const likedIndex = post.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (likedIndex !== -1) {
      // Unlike
      post.likes.splice(likedIndex, 1);
      await post.save();
      return res.json({
        message: "Post unliked",
        likesCount: post.likes.length,
      });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      return res.json({
        message: "Post liked",
        likesCount: post.likes.length,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to like post" });
  }
});




module.exports = router;
