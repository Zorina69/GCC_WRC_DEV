import { useState, useEffect, useCallback, useRef } from "react";
import "./RoomDivision.css";

// In dev, Vite proxies /api to your local backend.
// In prod (Vercel), there's no shared origin with Render, so we point
// straight at the deployed backend URL via an env var.
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/room-division`
  : "/api/room-division";
const COLOR_PALETTE = ["#0b3d5c","#0891b2","#16a34a","#7c3aed","#c73832","#e08900","#0e7c7b","#6d4aff"];

export default function RoomDivision() {
  const [peopleData, setPeopleData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomConfig, setRoomConfig] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [forceOverride, setForceOverride] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, msg }
  const [adminStatusMsg, setAdminStatusMsg] = useState("● Not logged in");

  const feedbackTimeout = useRef(null);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  // ---- Loaders ----
  const loadPeople = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/people`);
      setPeopleData(await res.json());
    } catch (e) {
      console.error("Error loading people:", e);
    }
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/config`);
      setRoomConfig(await res.json());
    } catch (e) {
      console.error("Error loading config:", e);
    }
  }, []);

  const loadRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rooms`);
      setRooms(await res.json());
    } catch (e) {
      console.error("Error loading rooms:", e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadConfig();
      await loadPeople();
      await loadRooms();
    })();
  }, [loadConfig, loadPeople, loadRooms]);

  useEffect(() => {
    const interval = setInterval(loadRooms, 10000);
    return () => clearInterval(interval);
  }, [loadRooms]);

  // Close admin panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        adminPanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setAdminPanelOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [adminPanelOpen]);

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setFeedback(null), 6000);
  };

  // ---- Helpers ----
  const getPerson = (name) => peopleData.find((p) => p.name === name);
  const getRoomConfig = (roomId) => roomConfig.find((r) => r.id === roomId);

  const isEligible = (roomId, person) => {
    const room = rooms.find((r) => r.id === roomId);
    const config = getRoomConfig(roomId);
    if (!room || !config || !person) return false;
    const { gender, type } = person;
    if (config.allowedType === "both") {
      if (gender !== "Female") return false;
    } else {
      if (gender !== config.allowedGender) return false;
      if (type !== config.allowedType) return false;
    }
    return room.occupants.length < room.capacity;
  };

  const getRoomState = (room) => {
    const occ = room.occupants.length;
    if (occ > room.capacity) return "over";
    if (occ >= room.capacity) return "full";
    if (occ === room.capacity - 1) return "limited";
    return "available";
  };

  // ---- Actions ----
  const assignPerson = async (roomId, person, force = false) => {
    try {
      const res = await fetch(`${API_BASE}/api/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, person, forceOverride: force }),
      });
      const data = await res.json();
      if (res.ok) {
        await loadRooms();
        if (data.forceApplied) {
          showFeedback(
            "warning",
            `⚠️ ${person.name} assigned to Room ${String(roomId).padStart(2, "0")} (OVERRIDE: ${data.room.occupants.length}/${data.room.capacity})`
          );
        } else {
          showFeedback("success", `${person.name} assigned to Room ${String(roomId).padStart(2, "0")}.`);
        }
        return true;
      } else {
        if (data.canForce) {
          showFeedback("error", `${data.error} (${data.currentOccupancy}/${data.capacity}) — Use Force Override if admin`);
        } else {
          showFeedback("error", data.error || "Assignment failed");
        }
        return false;
      }
    } catch {
      showFeedback("error", "Network error. Please try again.");
      return false;
    }
  };

  const removePerson = async (roomId, name) => {
    if (!isAdmin) {
      showFeedback("error", "Please login as admin to remove people.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, name, password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        await loadRooms();
        showFeedback("success", `Removed ${name} from Room ${String(roomId).padStart(2, "0")}.`);
      } else {
        showFeedback("error", data.error || "Removal failed");
      }
    } catch {
      showFeedback("error", "Network error. Please try again.");
    }
  };

  const resetAllRooms = async () => {
    if (!isAdmin) {
      showFeedback("error", "Please login as admin to reset rooms.");
      return;
    }
    if (!window.confirm("⚠️ Are you sure you want to reset ALL rooms? This cannot be undone!")) return;
    try {
      const res = await fetch(`${API_BASE}/api/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        await loadRooms();
        showFeedback("success", "All rooms have been reset.");
      } else {
        showFeedback("error", data.error || "Reset failed");
      }
    } catch {
      showFeedback("error", "Network error. Please try again.");
    }
  };

  const handleLogin = () => {
    if (!passwordInput) {
      showFeedback("error", "Please enter the admin password.");
      return;
    }
    setAdminPassword(passwordInput);
    setIsAdmin(true);
    setAdminStatusMsg("● Logged in as admin");
    setPasswordInput("");
    showFeedback("success", "Admin mode activated. You can now remove people and use Force Override.");
    setTimeout(() => setAdminPanelOpen(false), 1500);
  };

  const handleSubmit = async () => {
    if (forceOverride && !isAdmin) {
      showFeedback("error", "Force Override requires admin login. Please login first.");
      return;
    }
    if (!selectedName) return showFeedback("error", "Please select your name.");
    if (!selectedRoom) return showFeedback("error", "Please choose a room.");

    const roomId = parseInt(selectedRoom, 10);
    const person = getPerson(selectedName);
    if (!person) return showFeedback("error", "Participant not found.");

    const room = rooms.find((r) => r.id === roomId);
    if (!room) return showFeedback("error", "Invalid room.");

    if (room.occupants.some((p) => p.name === selectedName)) {
      return showFeedback("error", `${selectedName} is already in this room.`);
    }
    const already = rooms.some((r) => r.occupants.some((p) => p.name === selectedName));
    if (already) return showFeedback("error", `${selectedName} is already assigned to another room.`);

    const ok = await assignPerson(roomId, person, forceOverride);
    if (ok) {
      setSelectedName("");
      setSelectedRoom("");
    }
  };

  // ---- Derived data ----
  const total = 56;
  const occupied = rooms.reduce((s, r) => s + r.occupants.length, 0);
  const fullRooms = rooms.filter((r) => r.occupants.length >= r.capacity).length;
  const overRooms = rooms.filter((r) => r.occupants.length > r.capacity).length;
  const available = total - occupied;

  const assignedNames = new Set();
  rooms.forEach((r) => r.occupants.forEach((p) => assignedNames.add(p.name)));
  const unassigned = peopleData.filter((p) => !assignedNames.has(p.name));
  const selectedPerson = selectedName ? getPerson(selectedName) : null;

  return (
    <div className="rd-app">
      <div className="app">
        <div className="brand-bar">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 21v-6h6v6" />
                <path d="M9 10h.01" />
                <path d="M15 10h.01" />
              </svg>
            </div>
            <div>
              <h1>GCC FIELD RESEARCH 2026</h1>
              <div className="sub">Hak Seng Guest House · Kampot Province</div>
            </div>
          </div>
          <div className="admin-btn-container">
            <div className="stats">
              <div className="stat-pill"><span className="num">{occupied}/{total}</span><span className="lbl">Beds</span></div>
              <div className="stat-pill green"><span className="num">{available}</span><span className="lbl">Free</span></div>
              <div className="stat-pill red"><span className="num">{fullRooms}</span><span className="lbl">Full</span></div>
              <div className="stat-pill orange"><span className="num">{overRooms}</span><span className="lbl">Over</span></div>
            </div>
            <button
              ref={btnRef}
              className={`admin-btn ${adminPanelOpen ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setAdminPanelOpen((o) => !o); }}
            >
              {adminPanelOpen ? " Close Admin" : " Admin"}
            </button>
          </div>

          {adminPanelOpen && (
            <div className="admin-panel show" ref={panelRef}>
              <button className="close-btn" onClick={() => setAdminPanelOpen(false)}>✕</button>
              <h3> Admin Control</h3>
              <input
                type="password"
                placeholder="Enter admin password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <div className="btn-group">
                <button className="login-btn" onClick={handleLogin}>Login</button>
                <button className="reset-btn" onClick={resetAllRooms}>🗑️ Reset All</button>
              </div>
              <span className={`status ${isAdmin ? "active" : "inactive"}`}>{adminStatusMsg}</span>
            </div>
          )}
        </div>

        <div className="section-title"><span className="dash"></span> Room Overview</div>
        <div className="rooms-grid">
          {rooms.map((room) => {
            const state = getRoomState(room);
            const isOver = state === "over";
            const config = getRoomConfig(room.id);
            let typeLabel = config ? config.type : "";
            if (isOver) typeLabel += " ⚠️ OVER";
            const empty = Math.max(0, room.capacity - room.occupants.length);

            return (
              <div
                key={room.id}
                className={`room-card ${isOver ? "over-capacity" : ""}`}
                data-state={isOver ? "full" : state}
              >
                <div className="stripe"></div>
                <div className="room-head">
                  <span className="room-eyebrow">Room</span>
                  <span className="room-num">{String(room.id).padStart(2, "0")}</span>
                  <span className="room-type">{typeLabel}</span>
                  <span className="room-badge">{room.occupants.length}/{room.capacity}</span>
                  {isOver && <span className="force-badge">OVER</span>}
                </div>
                <div className="occupant-list">
                  {room.occupants.map((p, idx) => (
                    <div className="occupant-chip" key={p.name}>
                      <span className="avatar" style={{ background: COLOR_PALETTE[idx % COLOR_PALETTE.length] }}>
                        {p.name.slice(0, 2)}
                      </span>
                      {p.name}
                      <span className="sub">{p.role} · {p.type}</span>
                      {isAdmin && (
                        <button
                          className="remove-btn admin-mode"
                          title="Remove from room"
                          onClick={() => removePerson(room.id, p.name)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: empty }).map((_, i) => (
                    <div className="slot-empty" key={`empty-${i}`}>Open bed</div>
                  ))}
                </div>
                <div className="capacity-track">
                  <div
                    className="capacity-fill"
                    style={{ width: `${Math.min(100, (room.occupants.length / room.capacity) * 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="section-title"><span className="dash"></span> Check-In Desk</div>
        <div className="console">
          <div className="console-grid">
            <div className="field">
              <label>Select your name</label>
              <select
                value={selectedName}
                disabled={unassigned.length === 0}
                onChange={(e) => setSelectedName(e.target.value)}
              >
                <option value="" disabled>
                  {unassigned.length === 0 ? "All participants checked in" : "— Select your name —"}
                </option>
                {unassigned.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} ({p.gender}, {p.type})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Choose room</label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                <option value="" disabled>— Choose room —</option>
                {rooms.map((room) => {
                  const full = room.occupants.length >= room.capacity;
                  const overrideActive = forceOverride && isAdmin;
                  let disabled = full && !overrideActive;
                  if (selectedPerson && !full) disabled = !isEligible(room.id, selectedPerson);
                  let label = `Room ${String(room.id).padStart(2, "0")} — ${room.occupants.length}/${room.capacity}`;
                  if (full) label += " (Full)";
                  return (
                    <option key={room.id} value={room.id} disabled={disabled}>{label}</option>
                  );
                })}
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <button id="submitBtn" onClick={handleSubmit}>Assign Room</button>
              <div className="override-toggle">
                <input
                  type="checkbox"
                  id="forceOverride"
                  checked={forceOverride}
                  disabled={!isAdmin}
                  onChange={(e) => setForceOverride(e.target.checked)}
                />
                <label htmlFor="forceOverride" title={!isAdmin ? "Login as admin to use this" : ""}>
                  ⚠️ Force Override (admin only)
                </label>
              </div>
            </div>
          </div>
          {feedback && (
            <div className={`show ${feedback.type}`} id="feedback">
              {feedback.type === "success" ? "✓ " : "⚠ "}{feedback.msg}
            </div>
          )}
        </div>
        <footer>16 rooms · Various capacities · Click ✕ on any occupant to remove (admin only)</footer>
      </div>
    </div>
  );
}