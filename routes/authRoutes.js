const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// TEMP test route (browser-friendly)
router.get("/register", (req, res) => {
  res.send("Register route is working. Use POST to register users.");
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
