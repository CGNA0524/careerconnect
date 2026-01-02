const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Interview = require("../models/Interview");

const router = express.Router();

/**
 * START AI INTERVIEW
 */
router.post("/start", authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;

    const questions = [
      { question: `Tell me about yourself as a ${role}` },
      { question: `What are your strongest skills for ${role}?` },
      { question: `Explain a challenge you solved in ${role}.` },
    ];

    const interview = await Interview.create({
      user: req.user.id,
      role,
      questions,
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: "Failed to start interview" });
  }
});

/**
 * SUBMIT ANSWER
 */
router.post("/:id/answer", authMiddleware, async (req, res) => {
  try {
    const { index, answer } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.questions[index].answer = answer;

    // Simple mock scoring
    interview.questions[index].score =
      answer.length > 50 ? 10 : 5;

    interview.totalScore = interview.questions.reduce(
      (sum, q) => sum + q.score,
      0
    );

    await interview.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit answer" });
  }
});

/**
 * COMPLETE INTERVIEW
 */
router.post("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    interview.completed = true;
    await interview.save();

    res.json({
      message: "Interview completed",
      totalScore: interview.totalScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete interview" });
  }
});

/**
 * GET MY INTERVIEWS
 */
router.get("/me", authMiddleware, async (req, res) => {
  const interviews = await Interview.find({ user: req.user.id });
  res.json(interviews);
});

module.exports = router;
