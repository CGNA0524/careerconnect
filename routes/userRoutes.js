const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

/**
 * GET CURRENT USER PROFILE
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE PROFILE
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { headline, location, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { headline, location, skills },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET ALL USERS (FOR FOLLOW TESTING)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("name email followers following");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * FOLLOW / UNFOLLOW USER
 */
router.post("/:id/follow", authMiddleware, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);

      await currentUser.save();
      await targetUser.save();

      return res.json({ message: "User unfollowed" });
    } else {
      // FOLLOW
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);

      await currentUser.save();
      await targetUser.save();

      return res.json({ message: "User followed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Follow action failed" });
  }
});

module.exports = router;
