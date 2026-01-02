const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

/**
 * GET USER STATISTICS (DASHBOARD)
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    // Get user's posts
    const posts = await Post.find({ author: req.user.id });

    // Calculate stats
    const totalPosts = posts.length;

    const totalLikes = posts.reduce(
      (sum, post) => sum + post.likes.length,
      0
    );

    const totalComments = posts.reduce(
      (sum, post) => sum + post.comments.length,
      0
    );

    const followersCount = user.followers.length;
    const followingCount = user.following.length;

    res.json({
      totalPosts,
      totalLikes,
      totalComments,
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});

module.exports = router;
