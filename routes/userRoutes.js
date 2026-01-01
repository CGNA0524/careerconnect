const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Notification = require("../models/Notification");

const router = express.Router();

/**
 * ===============================
 * GET CURRENT USER PROFILE
 * ===============================
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ===============================
 * UPDATE PROFILE
 * ===============================
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ===============================
 * GET ALL USERS (for follow testing)
 * ===============================
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("name email followers following");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * ===============================
 * FOLLOW / UNFOLLOW USER
 * ===============================
 */
router.post("/:id/follow", authMiddleware, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);

      await currentUser.save();
      await targetUser.save();

      return res.json({ message: "User unfollowed" });
    }

    // FOLLOW
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    // 🔔 Create notification
    await Notification.create({
      user: targetUser._id,
      type: "FOLLOW",
      message: `${currentUser.name} followed you`,
      relatedUser: currentUser._id,
    });

    res.json({ message: "User followed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Follow action failed" });
  }
});

module.exports = router;
