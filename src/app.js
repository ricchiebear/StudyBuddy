// app.js (StudyBuddy)
const express = require("express");
const path = require("path");
const app = express();

// Lets the app read data coming from forms (POST)
app.use(express.urlencoded({ extended: true }));

// Tells Express where the pug files are
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Serves static files (css, images, etc)
app.use(express.static(path.join(__dirname, "public")));

// Database helper
const db = require("./services/db");

// --------------------
// ROUTE IMPORTS
// --------------------
const pagesRoutes = require("./routes/pages");
const usersRoutes = require("./routes/users");
const listingsRoutes = require("./routes/listings");

// --------------------
// USE ROUTES
// --------------------
app.use("/", pagesRoutes);          // Home, login, register, streaks
app.use("/users", usersRoutes);     // All user-related routes
app.use("/listings", listingsRoutes); // Listings / study sessions

// =====================================================
// DB TEST
// =====================================================
app.get("/db_test", async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).send("Database error");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000/");
  console.log("Try: http://127.0.0.1:3000/users");
});