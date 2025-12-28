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

module.exports = router;
