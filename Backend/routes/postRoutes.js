const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// GET ALL POSTS (GLOBAL FEED)
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// ===============================
// CREATE POST
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const post = new Post({
      author: req.user.id,
      content: req.body.content,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name");

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
});

// ===============================
// LIKE / UNLIKE POST
// ===============================
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
});

// ===============================
// ADD COMMENT
// ===============================
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      user: req.user.id,
      text: req.body.text,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("comments.user", "name");

    res.json({ comments: updatedPost.comments });
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

module.exports = router;
