const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

module.exports.requireLogin = requireLogin;

// Make user available in all views 
router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


// LOGIN PAGE

router.get("/login", (req, res) => {
  res.render("login");
});


// LOGIN HANDLER

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.send("User not found");
    }

    const user = rows[0];
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        return res.send("Incorrect password");
    }

    req.session.user = user;
    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
});


// REGISTER PAGE

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});


// REGISTER HANDLER

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, degree, email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@roehampton\.ac\.uk$/;

    if (!emailRegex.test(email)) {
      return res.render("register", {
        title: "Register",
        error: "You must use a Roehampton email (@roehampton.ac.uk)",
        formData: req.body
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.render("register", {
        title: "Register",
        error: "This email is already registered"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
        "INSERT INTO users (first_name, last_name, degree, email, password) VALUES (?, ?, ?, ?, ?)",
        [first_name, last_name, degree, email, hashedPassword]
    );

    res.redirect("/login");

  } catch (err) {
    console.error(err);
    res.status(500).send("Register error");
  }
});

// Forgot Password Page 

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

//F.P Email Submission
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const [users] = await db.query(
    "SELECT user_id FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    return res.send("No account with that email.");
  }

  const userId = users[0].user_id;

  // create secure token
  const token = crypto.randomBytes(32).toString("hex");

  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 mins

  await db.query(
    "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expires]
  );

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  // FOR NOW: show link instead of email
  res.send(`<a href="${resetLink}">Reset Password</a>`);
});

// Reset Password Page
router.get("/reset-password", async (req, res) => {
  const { token } = req.query;

  const [rows] = await db.query(
    "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
    [token]
  );

  if (rows.length === 0) {
    return res.send("Invalid or expired token");
  }

  res.render("reset-password", { token });
});

//Save New Password:

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
    [token]
  );

  if (rows.length === 0) {
    return res.send("Invalid or expired token");
  }

  const userId = rows[0].user_id;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "UPDATE users SET password = ? WHERE user_id = ?",
    [hashedPassword, userId]
  );

  await db.query(
    "DELETE FROM password_resets WHERE user_id = ?",
    [userId]
  );

  res.send("✅ Password reset successful!");
});

// LOGOUT

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
module.exports.requireLogin = requireLogin;