const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/", async (req, res) => {
  try {
    const listings = await db.query("SELECT * FROM listings");
    res.json(listings);
  } catch (err) {
    console.error("Listings error:", err);
    res.status(500).send("Database error");
  }
});

module.exports = router;