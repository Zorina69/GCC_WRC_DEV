// backend/routes/participants.js
import express from "express";
import { db } from "../lib/firebase.js";

const router = express.Router();

// ── GET /participants/:event → all participants
router.get("/:event", async (req, res) => {
  try {
    const { event } = req.params;
    const snapshot = await db.ref(`${event}/participants`).get();

    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, error: "No participants found" });
    }

    const data = snapshot.val();

    // Normalize to array with _index attached
    const list = Array.isArray(data)
      ? data.filter(Boolean).map((item, i) => ({ _index: i, ...item }))
      : Object.entries(data)
          .filter(([, v]) => v !== null)
          .map(([key, value]) => ({ _index: key, ...value }));

    return res.json({ success: true, event, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /participants/:event → add new participant
router.post("/:event", async (req, res) => {
  try {
    const { event } = req.params;
    const body = req.body;

    if (!body?.id || !body?.name_khmer) {
      return res.status(400).json({ success: false, error: "id and name_khmer are required" });
    }

    const snapshot = await db.ref(`${event}/participants`).get();
    const current = snapshot.val();

    const nextIndex = current
      ? Array.isArray(current)
        ? current.filter(Boolean).length
        : Object.keys(current).length
      : 0;

    await db.ref(`${event}/participants/${nextIndex}`).set({
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return res.status(201).json({ success: true, index: nextIndex, event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PUT /participants/:event/:index → update participant
router.put("/:event/:index", async (req, res) => {
  try {
    const { event, index } = req.params;
    const { _index, ...body } = req.body;

    await db.ref(`${event}/participants/${index}`).update({
      ...body,
      updatedAt: Date.now(),
    });

    return res.json({ success: true, message: "Updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /participants/:event/:index → delete participant
router.delete("/:event/:index", async (req, res) => {
  try {
    const { event, index } = req.params;
    await db.ref(`${event}/participants/${index}`).remove();
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;