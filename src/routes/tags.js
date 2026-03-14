const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Presenting all the Subject/ Tags
router.get("/", async (req, res) => {
  try {
    const tags = await db.query(
      "SELECT tag_id, name FROM categories ORDER BY name ASC"
    );

    res.render("tags", {
      title: "Subjects",
      tags: tags
    });

  } catch (err) {
    console.error("Tags list error:", err);
    res.status(500).send("Something went wrong loading tags.");
  }
});


// Showing the corresponsing listings to each tag 

router.get("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;

    const listings = await db.query(`
      SELECT l.listing_id, l.title, l.module, l.location, l.start_time, l.status
      FROM listings l
      JOIN listing_tags lt ON l.listing_id = lt.listing_id
      WHERE lt.tag_id = ?
      ORDER BY l.start_time ASC
    `, [tagId]);

    const tag = await db.query(
      "SELECT name FROM categories WHERE tag_id = ?",
      [tagId]
    );

    res.render("tag-listings", {
      title: tag[0].name,
      listings: listings,
      tag: tag[0]
    });

  } catch (err) {
    console.error("Tag listings error:", err);
    res.status(500).send("Something went wrong loading tag listings.");
  }
});

module.exports = router;