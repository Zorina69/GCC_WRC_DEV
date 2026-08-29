import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import escRoute from "./routes/profile.js";
import participantsRoute from "./routes/participant.js";
import eventsRoute from "./routes/events.js";
import roomDivisionRoute from "./routes/room_division.js";
import gccftRoute from "./routes/profile_gcc2026.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/esc2026", escRoute);
app.use("/participant", participantsRoute);
app.use("/events", eventsRoute);
app.use("/api/room-division", roomDivisionRoute);
app.use("/gccft2026", gccftRoute)

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});