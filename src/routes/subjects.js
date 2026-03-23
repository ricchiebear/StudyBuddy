const express = require("express");
const router = express.Router();
const db = require("../services/db");

//getting list of all Degrees to display on screen
router.get("/", async (req, res) => {
  try {
    const [degrees] = await db.query(
  "SELECT DISTINCT degree FROM modules ORDER BY degree ASC"
);
    res.render("tags", {
      title: "Subjects",
      degrees: degrees,
      selectedDegree: null,
      modules: null
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading degrees");
  }
});


router.get("/:degree", async (req, res) => {
  try {
    const degree = decodeURIComponent(req.params.degree);

    const [modules] = await db.query(
  "SELECT * FROM modules WHERE degree = ?",
  [degree]
);

    res.render("tags", {
      title: "StudyBuddy",
      degrees: [],
      selectedDegree: degree,
      modules: modules
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading modules");
  }
});

module.exports = router;