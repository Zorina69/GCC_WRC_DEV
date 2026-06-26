import express from "express";
import { db } from "../lib/firebase.js";

const router = express.Router();

// GET profile
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.ref("ESC_2026/participants").get();

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "No participants found" });
    }

    res.json(snapshot.val());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const snapshot = await db.ref("ESC_2026/participants").get();
    const data = snapshot.val();

    const participant = data.find((p) => p.id === id);

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.json(participant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
