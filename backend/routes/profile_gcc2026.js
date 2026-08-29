import express from "express";
import { db } from "../lib/firebase.js";

const router = express.Router();

// GET profile
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.ref("GCCFT_2026/participants").get();

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

    const snapshot = await db.ref("GCCFT_2026/participants").get();

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const raw = snapshot.val();

    // Firebase returns an object { "0": {...}, "1": {...} } or an array
    // Normalize to a flat array either way (same shape as the list endpoint)
    const allData = Array.isArray(raw)
      ? raw
      : Object.values(raw).flatMap((v) =>
          Array.isArray(v) ? v : Object.values(v)
        );

    const participant = allData.find((p) => String(p.id) === id);

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.json(participant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
