const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Login route is working. Use POST to login.");
});


router.post("/register", register);
router.post("/login", login);

module.exports = router;
