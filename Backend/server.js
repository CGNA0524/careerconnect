const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load env variables
dotenv.config();

// DB connection
const connectDB = require("./config/db");
connectDB();

// Create app
const app = express();

/**
 * ===============================
 * MIDDLEWARE
 * ===============================
 */

// CORS (Frontend: Vite @ 5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ===============================
 * STATIC FILES (MEDIA UPLOADS)
 * ===============================
 * Images / Videos will be served from:
 * http://localhost:3000/uploads/filename.ext
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * ===============================
 * ROUTES
 * ===============================
 */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/interviews", require("./routes/interviewRoutes"));
app.use("/api/users", require("./routes/statsRoutes")); // if statsRoutes mounted here

/**
 * ===============================
 * ROOT TEST
 * ===============================
 */
app.get("/", (req, res) => {
  res.send("CareerConnect Backend Running 🚀");
});

/**
 * ===============================
 * SERVER
 * ===============================
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
