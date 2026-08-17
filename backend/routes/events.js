// backend/routes/events.js
import express from "express";
import { db } from "../lib/firebase.js";

const router = express.Router();

const EVENTS_PATH = "admin_events";
const DEFAULT_EVENTS = ["ESC_2026", "WRC_2026", "WRC_2027", "WRC_2028"];
const EVENT_KEY_RE = /^[A-Za-z0-9_]+$/;

// ── GET /events → list all known event keys
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.ref(EVENTS_PATH).get();

    if (!snapshot.exists()) {
      // First run: seed the index with the events already in use
      const seed = Object.fromEntries(DEFAULT_EVENTS.map((ev) => [ev, true]));
      await db.ref(EVENTS_PATH).set(seed);
      return res.json({ success: true, events: DEFAULT_EVENTS });
    }

    const events = Object.keys(snapshot.val()).sort();
    return res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /events → add a new event { event: "ESC_2027" }
router.post("/", async (req, res) => {
  try {
    const event = (req.body?.event || "").trim();

    if (!EVENT_KEY_RE.test(event)) {
      return res.status(400).json({ success: false, error: "Event key must contain only letters, numbers, and underscores (e.g. ESC_2027)" });
    }

    const existing = await db.ref(`${EVENTS_PATH}/${event}`).get();
    if (existing.exists()) {
      return res.status(409).json({ success: false, error: "Event already exists" });
    }

    await db.ref(`${EVENTS_PATH}/${event}`).set(true);
    return res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /events/:event → remove an event and all its participants
router.delete("/:event", async (req, res) => {
  try {
    const { event } = req.params;
    await db.ref(`${EVENTS_PATH}/${event}`).remove();
    await db.ref(event).remove();
    return res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
