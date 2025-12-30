const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");

const router = express.Router();

// =======================
// Create a post
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user.id,
      content: req.body.content,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// =======================
// Get global feed
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// =======================
// Like / Unlike a post
// =======================
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

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

// =======================
// Add comment to a post
// =======================
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();

    res.status(201).json({
      message: "Comment added",
      comments: post.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// Edit post (owner only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.content = req.body.content || post.content;
    await post.save();

    res.json({ message: "Post updated", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
});

// Delete post (owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});


module.exports = router;
