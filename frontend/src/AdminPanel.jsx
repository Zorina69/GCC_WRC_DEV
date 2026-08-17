// frontend/src/AdminPanel.jsx
import { useState, useEffect, useCallback } from "react";
import {
  fetchParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  fetchEvents,
  addEvent,
  deleteEvent,
} from "./lib/apiClient";
import profileImage from "./assets/default-profile.png";

const ADMIN_PASSWORD = "1234";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dcphqmybu/image/upload";
const getProfileImage = (id) => {
  if (!id) return profileImage;
  return `${CLOUDINARY_BASE}/f_auto,q_auto/ID_${id}`;
};

const formatLabel = (ev) => {
  const m = ev.match(/^([A-Z]+)_(\d+)$/);
  return m ? { prefix: m[1], year: m[2] } : { prefix: ev, year: "" };
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700;900&display=swap');

  html, body, #root { margin: 0; padding: 0; width: 100%; }
  .ap-root *, .ap-root *::before, .ap-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ap-overlay *, .ap-overlay *::before, .ap-overlay *::after { box-sizing: border-box; }

  .ap-root {
    font-family: 'Kantumruy Pro', sans-serif;
    background: #f4f7f5;
    color: #26332b;
    min-width: 100vw;
    min-height: 100vh;
    flex-shrink: 0;
  }

  /* ── Login ── */
  .ap-login {
    width: 100vw; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    font-family: 'Kantumruy Pro', sans-serif;
  }
  .ap-login-box {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(46,125,50,0.15);
    padding: 2.5rem 2.25rem;
    width: 100%; max-width: 360px;
    text-align: center;
  }
  .ap-login-logo { font-size: 2.2rem; font-weight: 800; letter-spacing: 2px; color: #2e7d32; margin-bottom: 0.25rem; }
  .ap-login-sub { font-size: 0.85rem; letter-spacing: 1px; color: #8a8fa8; margin-bottom: 2rem; }
  .ap-login-label { display: block; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-align: left; margin-bottom: 0.4rem; }
  .ap-login-input { width: 100%; background: #f7f8fa; border: 1.5px solid #e2e8e4; color: #26332b; padding: 0.7rem 1rem; border-radius: 10px; font-family: 'Kantumruy Pro', sans-serif; font-size: 1rem; outline: none; transition: border-color 0.15s; margin-bottom: 1.25rem; }
  .ap-login-input:focus { border-color: #2e7d32; }
  .ap-login-btn { width: 100%; background: #2e7d32; color: #fff; border: none; padding: 0.75rem; border-radius: 50px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
  .ap-login-btn:hover { background: #256428; }
  .ap-login-err { color: #e53935; font-size: 0.8rem; margin-top: 0.75rem; }

  /* ── Header ── */
  .ap-header {
    background: #fff;
    border-bottom: 1px solid #e2e8e4;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.75rem;
  }
  .ap-header-left { display: flex; align-items: center; gap: 0.9rem; }
  .ap-back { background: #f0f4f1; border: none; color: #2e7d32; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .ap-back:hover { background: #dcece0; }
  .ap-logo { font-size: 1.3rem; font-weight: 800; letter-spacing: 1px; color: #2e7d32; }
  .ap-header-title { font-size: 0.95rem; font-weight: 600; color: #6b7280; }
  .ap-logout { background: none; border: 1.5px solid #e2e8e4; color: #6b7280; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .ap-logout:hover { border-color: #e53935; color: #e53935; }

  .ap-page { max-width: 1100px; margin: 0 auto; padding: 2rem 1.75rem 3rem; }

  /* ── Events grid ── */
  .ap-events-intro { margin-bottom: 1.5rem; }
  .ap-events-title { font-size: 1.5rem; font-weight: 800; color: #1b5e20; margin-bottom: 0.25rem; }
  .ap-events-sub { color: #8a8fa8; font-size: 0.9rem; }
  .ap-events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
  .ap-event-card {
    background: #fff; border-radius: 16px; padding: 1.5rem;
    box-shadow: 0 4px 16px rgba(46,125,50,0.08);
    cursor: pointer; text-align: left; border: none;
    transition: transform 0.15s, box-shadow 0.15s;
    font-family: 'Kantumruy Pro', sans-serif;
    position: relative;
  }
  .ap-event-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(46,125,50,0.16); }
  .ap-event-name { font-size: 1.3rem; font-weight: 800; color: #2e7d32; }
  .ap-event-year { font-size: 0.9rem; color: #8a8fa8; margin-bottom: 0.9rem; }
  .ap-event-count { font-size: 0.8rem; font-weight: 600; color: #6b7280; background: #f0f4f1; display: inline-block; padding: 0.3rem 0.7rem; border-radius: 50px; }
  .ap-event-del { position: absolute; top: 0.75rem; right: 0.75rem; width: 26px; height: 26px; border-radius: 50%; border: none; background: #f7f8fa; color: #c4cbc6; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .ap-event-del:hover { background: #fdecea; color: #e53935; }
  .ap-event-card-add {
    background: #fff; border-radius: 16px; padding: 1.5rem;
    border: 2px dashed #cfe0d2; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem;
    color: #2e7d32; font-family: 'Kantumruy Pro', sans-serif; font-weight: 700;
    transition: all 0.15s; min-height: 110px;
  }
  .ap-event-card-add:hover { background: #f0f9f1; border-color: #2e7d32; }
  .ap-event-card-add-icon { font-size: 1.6rem; }

  /* ── Toolbar ── */
  .ap-toolbar { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .ap-toolbar-info { margin-right: auto; }
  .ap-page-title { font-size: 1.4rem; font-weight: 800; color: #1b5e20; }
  .ap-page-count { font-size: 0.85rem; color: #8a8fa8; }
  .ap-search { background: #fff; border: 1.5px solid #e2e8e4; color: #26332b; padding: 0.55rem 1rem; border-radius: 50px; font-family: 'Kantumruy Pro', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.15s; width: 240px; }
  .ap-search:focus { border-color: #2e7d32; }

  /* ── Buttons ── */
  .ap-btn { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.55rem 1.1rem; border: none; border-radius: 50px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: 'Kantumruy Pro', sans-serif; }
  .ap-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ap-btn-primary { background: #2e7d32; color: #fff; }
  .ap-btn-primary:hover:not(:disabled) { background: #256428; }
  .ap-btn-ghost { background: #fff; color: #26332b; border: 1.5px solid #e2e8e4; }
  .ap-btn-ghost:hover:not(:disabled) { border-color: #2e7d32; color: #2e7d32; }
  .ap-btn-danger { background: #fdecea; color: #e53935; border: 1.5px solid #f6c6c2; }
  .ap-btn-danger:hover:not(:disabled) { background: #e53935; color: #fff; }
  .ap-btn-sm { padding: 0.32rem 0.7rem; font-size: 0.75rem; }

  /* ── List (cards, simplified info) ── */
  .ap-list { display: flex; flex-direction: column; gap: 0.6rem; }
  .ap-row {
    background: #fff; border-radius: 14px; padding: 0.85rem 1.1rem;
    display: flex; align-items: center; gap: 1rem;
    box-shadow: 0 2px 10px rgba(46,125,50,0.06);
    cursor: pointer; border: none; text-align: left; width: 100%;
    font-family: 'Kantumruy Pro', sans-serif;
    transition: box-shadow 0.15s, transform 0.15s;
  }
  .ap-row:hover { box-shadow: 0 6px 20px rgba(46,125,50,0.14); transform: translateY(-1px); }
  .ap-row-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; background: #e8f5e9; flex-shrink: 0; }
  .ap-row-main { flex: 1; min-width: 0; }
  .ap-row-name { font-size: 1rem; font-weight: 700; color: #1b5e20; }
  .ap-row-sub { font-size: 0.82rem; color: #8a8fa8; }
  .ap-row-org { font-size: 0.82rem; color: #6b7280; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-id-badge { font-size: 0.75rem; font-weight: 700; color: #2e7d32; background: #e8f5e9; padding: 0.2rem 0.6rem; border-radius: 50px; white-space: nowrap; }
  .ap-chevron { color: #c4cbc6; font-size: 1.1rem; }

  /* ── Empty / Loading ── */
  .ap-empty { text-align: center; padding: 4rem 2rem; color: #8a8fa8; }
  .ap-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .ap-empty-title { font-size: 1rem; }
  .ap-loading { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 4rem; color: #8a8fa8; font-size: 0.9rem; }
  .ap-spinner { width: 18px; height: 18px; border: 2.5px solid #dcece0; border-top-color: #2e7d32; border-radius: 50%; animation: ap-spin 0.6s linear infinite; }
  @keyframes ap-spin { to { transform: rotate(360deg); } }

  /* ── Detail card ── */
  .ap-detail-card { background: #fff; border-radius: 24px; box-shadow: 0 16px 48px rgba(46,125,50,0.12); overflow: hidden; max-width: 480px; margin: 0 auto; }
  .ap-detail-banner { height: 10px; background: linear-gradient(90deg, #a5d6a7, #2e7d32, #1b5e20); }
  .ap-detail-avatar-wrap { display: flex; justify-content: center; padding: 1.75rem 0 1rem; }
  .ap-detail-avatar { width: 120px; height: 120px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 6px 20px rgba(46,125,50,0.22); object-fit: cover; background: #e8f5e9; }
  .ap-detail-name-block { text-align: center; padding: 0 1.5rem 1.5rem; }
  .ap-detail-name { font-size: 1.3rem; font-weight: 800; color: #1b5e20; }
  .ap-detail-name-latin { font-size: 0.95rem; color: #8a8fa8; margin-top: 2px; }
  .ap-detail-fields { padding: 0 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 0.65rem; }
  .ap-detail-field { background: #f7f8fa; border-radius: 12px; padding: 0.7rem 1rem; }
  .ap-detail-label { font-size: 0.7rem; color: #8a8fa8; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .ap-detail-value { font-size: 0.95rem; font-weight: 600; color: #26332b; }
  .ap-detail-section-label { font-size: 0.72rem; font-weight: 700; color: #8a8fa8; text-transform: uppercase; letter-spacing: 1px; margin: 0.5rem 0 0.1rem; }
  .ap-detail-actions { display: flex; gap: 0.6rem; padding: 0 1.5rem 1.75rem; }
  .ap-detail-actions .ap-btn { flex: 1; justify-content: center; }

  /* ── Modal ── */
  .ap-overlay { position: fixed; inset: 0; background: rgba(20,30,22,0.55); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 1rem; }
  .ap-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 1.75rem; animation: ap-slideup 0.2s ease; font-family: 'Kantumruy Pro', sans-serif; }
  @keyframes ap-slideup { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .ap-modal-title { font-size: 1.25rem; font-weight: 800; color: #1b5e20; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8e4; }
  .ap-section-label { font-size: 0.72rem; font-weight: 700; color: #8a8fa8; text-transform: uppercase; letter-spacing: 1px; margin: 1.25rem 0 0.75rem; }
  .ap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .ap-grid-full { grid-column: 1 / -1; }
  .ap-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .ap-field label { font-size: 0.72rem; font-weight: 600; color: #6b7280; }
  .ap-field input { background: #f7f8fa; border: 1.5px solid #e2e8e4; color: #26332b; padding: 0.55rem 0.8rem; border-radius: 10px; font-family: 'Kantumruy Pro', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.15s; width: 100%; }
  .ap-field input:focus { border-color: #2e7d32; }
  .ap-field input:disabled { opacity: 0.5; cursor: not-allowed; }
  .ap-field-hint { font-size: 0.7rem; color: #8a8fa8; font-style: italic; }
  .ap-field-required { color: #e53935; }
  .ap-modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e2e8e4; }
  .ap-inline-err { color: #e53935; font-size: 0.8rem; margin-top: 0.75rem; background: #fdecea; padding: 0.6rem 0.85rem; border-radius: 10px; }
  .ap-confirm-body { color: #6b7280; font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.5rem; }
  .ap-confirm-name { color: #26332b; font-weight: 700; }
  .ap-confirm-warning { background: #fdecea; border-radius: 10px; padding: 0.6rem 0.85rem; font-size: 0.8rem; color: #e53935; margin-top: 0.75rem; }

  /* ── Toast ── */
  .ap-toast { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 999999; background: #fff; border-radius: 12px; border-left: 4px solid #43a047; padding: 0.7rem 1.2rem; font-size: 0.9rem; color: #26332b; animation: ap-toast-in 0.2s ease; box-shadow: 0 8px 28px rgba(0,0,0,0.14); font-family: 'Kantumruy Pro', sans-serif; }
  .ap-toast.error { border-left-color: #e53935; }
  @keyframes ap-toast-in { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return <div className={`ap-toast${type === "error" ? " error" : ""}`}>{msg}</div>;
}

// ─── Participant Modal (add/edit) ──────────────────────────────────────────────
const EMPTY_FORM = {
  id: "", name_khmer: "", name_latin: "",
  organization: "", role: "", phone: "", address: "",
  emergency_contact: { name: "", relation: "", phone: "" },
};

function ParticipantModal({ mode, participant, event, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === "edit"
      ? { ...participant, emergency_contact: participant.emergency_contact || { name: "", relation: "", phone: "" } }
      : { ...EMPTY_FORM, emergency_contact: { name: "", relation: "", phone: "" } }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setEC = (k) => (e) => setForm((f) => ({ ...f, emergency_contact: { ...f.emergency_contact, [k]: e.target.value } }));

  const handleSubmit = async () => {
    if (!form.id?.trim() || !form.name_khmer?.trim()) { setErr("Participant ID and Khmer name are required."); return; }
    setSaving(true); setErr("");
    try {
      const { _index, createdAt, updatedAt, ...data } = form;
      if (mode === "edit") { await updateParticipant(event, participant._index, data); onSave("Participant updated"); }
      else { await addParticipant(event, data); onSave("Participant added"); }
    } catch (e) { setErr(e.message || "Something went wrong"); setSaving(false); }
  };

  return (
    <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <div className="ap-modal">
        <div className="ap-modal-title">{mode === "edit" ? "Edit Participant" : "Add Participant"}</div>

        <div className="ap-section-label">Basic Info</div>
        <div className="ap-grid">
          <div className="ap-field">
            <label>Participant ID <span className="ap-field-required">*</span></label>
            <input value={form.id} onChange={set("id")} placeholder="ESC26xx" disabled={mode === "edit"} />
            {mode === "add" && <span className="ap-field-hint">e.g. ESC2601</span>}
          </div>
          <div className="ap-field">
            <label>Role</label>
            <input value={form.role} onChange={set("role")} placeholder="សមាជិក, ក្រុមការងារ, បេក្ខជន" />
          </div>
          <div className="ap-field">
            <label>Name (Khmer) <span className="ap-field-required">*</span></label>
            <input value={form.name_khmer} onChange={set("name_khmer")} placeholder="សុខ ពិសី" style={{ fontSize: "1rem" }} />
          </div>
          <div className="ap-field">
            <label>Name (Latin)</label>
            <input value={form.name_latin} onChange={set("name_latin")} placeholder="Sok Pisey" />
          </div>
          <div className="ap-field">
            <label>Organization</label>
            <input value={form.organization} onChange={set("organization")} placeholder="School/ Club Name" />
          </div>
          <div className="ap-field">
            <label>Phone</label>
            <input value={form.phone} onChange={set("phone")} placeholder="+855 12 345 678" />
          </div>
          <div className="ap-field ap-grid-full">
            <label>Address</label>
            <input value={form.address} onChange={set("address")} placeholder="រាជធានីភ្នំពេញ" style={{ fontSize: "1rem" }} />
          </div>
        </div>

        <div className="ap-section-label">Emergency Contact</div>
        <div className="ap-grid">
          <div className="ap-field">
            <label>Contact Name</label>
            <input value={form.emergency_contact?.name} onChange={setEC("name")} placeholder="Full name" />
          </div>
          <div className="ap-field">
            <label>Relation</label>
            <input value={form.emergency_contact?.relation} onChange={setEC("relation")} placeholder="Parent / Spouse…" />
          </div>
          <div className="ap-field ap-grid-full">
            <label>Contact Phone</label>
            <input value={form.emergency_contact?.phone} onChange={setEC("phone")} placeholder="+855 12 000 000" />
          </div>
        </div>

        {err && <div className="ap-inline-err">⚠ {err}</div>}
        <div className="ap-modal-actions">
          <button className="ap-btn ap-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ap-btn ap-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : mode === "edit" ? "Update" : "Add Participant"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete ───────────────────────────────────────────────────────────
function ConfirmModal({ title, body, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && !deleting && onClose()}>
      <div className="ap-modal" style={{ maxWidth: 420 }}>
        <div className="ap-modal-title">{title}</div>
        <p className="ap-confirm-body">{body}</p>
        <div className="ap-confirm-warning">⚠ This action cannot be undone.</div>
        <div className="ap-modal-actions">
          <button className="ap-btn ap-btn-ghost" onClick={onClose} disabled={deleting}>Cancel</button>
          <button className="ap-btn ap-btn-danger" disabled={deleting} onClick={async () => { setDeleting(true); await onConfirm(); }}>
            {deleting ? "Deleting…" : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Event Modal ────────────────────────────────────────────────────────
function EventModal({ onClose, onSave }) {
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    const trimmed = key.trim().toUpperCase();
    if (!trimmed) { setErr("Event key is required."); return; }
    setSaving(true); setErr("");
    try {
      await addEvent(trimmed);
      onSave(trimmed);
    } catch (e) { setErr(e.message || "Something went wrong"); setSaving(false); }
  };

  return (
    <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <div className="ap-modal" style={{ maxWidth: 420 }}>
        <div className="ap-modal-title">Add Event</div>
        <div className="ap-field">
          <label>Event Key</label>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ESC_2027"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <span className="ap-field-hint">Letters, numbers, underscores only — e.g. ESC_2027</span>
        </div>
        {err && <div className="ap-inline-err">⚠ {err}</div>}
        <div className="ap-modal-actions">
          <button className="ap-btn ap-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ap-btn ap-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Adding…" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail field helper ────────────────────────────────────────────────────
const DetailField = ({ label, value }) => (
  <div className="ap-detail-field">
    <div className="ap-detail-label">{label}</div>
    <div className="ap-detail-value">{value || "—"}</div>
  </div>
);

// ─── Admin Panel ──────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [view, setView] = useState("events"); // "events" | "list" | "detail"
  const [events, setEvents] = useState([]);
  const [eventCounts, setEventCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(false);

  const [activeEvent, setActiveEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => setToast({ msg, type });

  const loadCounts = useCallback(async () => {
    setCountsLoading(true);
    try {
      const evs = await fetchEvents();
      setEvents(evs);
      const entries = await Promise.all(
        evs.map(async (ev) => [ev, (await fetchParticipants(ev)).length])
      );
      setEventCounts(Object.fromEntries(entries));
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setCountsLoading(false);
    }
  }, []);

  useEffect(() => { if (isAuth && view === "events") loadCounts(); }, [isAuth, view, loadCounts]);

  const loadParticipants = useCallback(async (ev) => {
    setLoading(true);
    try {
      const data = await fetchParticipants(ev);
      setParticipants(Array.isArray(data) ? data : []);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const openEvent = (ev) => {
    setActiveEvent(ev);
    setSearch("");
    setView("list");
    loadParticipants(ev);
  };

  const handleSave = async (msg) => {
    setModal(null); showToast(msg);
    await loadParticipants(activeEvent);
    if (view === "detail" && selected) {
      const updated = (await fetchParticipants(activeEvent)).find((p) => p._index === selected._index);
      setSelected(updated || null);
      if (!updated) setView("list");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteParticipant(activeEvent, modal.participant._index);
      setModal(null); showToast("Participant deleted");
      await loadParticipants(activeEvent);
      setView("list"); setSelected(null);
    } catch (e) { setModal(null); showToast(e.message, "error"); }
  };

  const handleEventAdded = (ev) => { setModal(null); showToast(`Event ${ev} added`); loadCounts(); };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(modal.event);
      setModal(null); showToast("Event deleted");
      loadCounts();
    } catch (e) { setModal(null); showToast(e.message, "error"); }
  };

  const filtered = participants.filter((p) =>
    [p.id, p.name_khmer, p.name_latin, p.organization, p.role, p.address]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // ── Login ──────────────────────────────────────
  if (!isAuth) {
    return (
      <>
        <style>{css}</style>
        <div className="ap-login">
          <div className="ap-login-box">
            <div className="ap-login-logo">GCC Admin</div>
            <div className="ap-login-sub">Admin Portal</div>
            <label className="ap-login-label">Password</label>
            <input
              className="ap-login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginErr(""); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (password === ADMIN_PASSWORD) setIsAuth(true);
                  else setLoginErr("Incorrect password");
                }
              }}
            />
            <button className="ap-login-btn" onClick={() => {
              if (password === ADMIN_PASSWORD) setIsAuth(true);
              else setLoginErr("Incorrect password");
            }}>Sign In</button>
            {loginErr && <div className="ap-login-err">{loginErr}</div>}
          </div>
        </div>
      </>
    );
  }

  const headerTitle =
    view === "events" ? "Events" :
    view === "list" ? formatLabel(activeEvent).prefix + " " + formatLabel(activeEvent).year :
    selected?.name_khmer;

  return (
    <>
      <style>{css}</style>
      <div className="ap-root">
        {/* Header */}
        <header className="ap-header">
          <div className="ap-header-left">
            {view !== "events" && (
              <button
                className="ap-back"
                onClick={() => view === "detail" ? (setView("list"), setSelected(null)) : (setView("events"), setActiveEvent(null))}
              >←</button>
            )}
            <div className="ap-logo">GCC Admin</div>
            <div className="ap-header-title">{headerTitle}</div>
          </div>
          <button className="ap-logout" onClick={() => { setIsAuth(false); setPassword(""); setView("events"); }}>Sign Out</button>
        </header>

        <div className="ap-page">
          {/* ── Events view ── */}
          {view === "events" && (
            <>
              <div className="ap-events-intro">
                <div className="ap-events-title">Choose an event</div>
                <div className="ap-events-sub">Select an event to manage its participants</div>
              </div>
              <div className="ap-events-grid">
                {events.map((ev) => {
                  const { prefix, year } = formatLabel(ev);
                  return (
                    <div
                      key={ev}
                      className="ap-event-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => openEvent(ev)}
                      onKeyDown={(e) => e.key === "Enter" && openEvent(ev)}
                    >
                      <button
                        className="ap-event-del"
                        title="Delete event"
                        onClick={(e) => { e.stopPropagation(); setModal({ type: "delete-event", event: ev }); }}
                      >✕</button>
                      <div className="ap-event-name">{prefix}</div>
                      <div className="ap-event-year">{year}</div>
                      <div className="ap-event-count">
                        {countsLoading ? "…" : `${eventCounts[ev] ?? 0} participant${eventCounts[ev] === 1 ? "" : "s"}`}
                      </div>
                    </div>
                  );
                })}
                <div className="ap-event-card-add" onClick={() => setModal({ type: "add-event" })}>
                  <div className="ap-event-card-add-icon">+</div>
                  <div>Add Event</div>
                </div>
              </div>
            </>
          )}

          {/* ── List view (simplified info) ── */}
          {view === "list" && (
            <>
              <div className="ap-toolbar">
                <div className="ap-toolbar-info">
                  <div className="ap-page-title">{formatLabel(activeEvent).prefix} {formatLabel(activeEvent).year}</div>
                  {!loading && <div className="ap-page-count">{filtered.length} participant{filtered.length !== 1 ? "s" : ""}</div>}
                </div>
                <input className="ap-search" placeholder="Search ID, name, org…" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className="ap-btn ap-btn-primary" onClick={() => setModal({ type: "add" })}>+ Add Participant</button>
              </div>

              {loading ? (
                <div className="ap-loading"><div className="ap-spinner" /> Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="ap-empty">
                  <div className="ap-empty-icon">{search ? "🔍" : "👤"}</div>
                  <div className="ap-empty-title">{search ? "No results found" : "No participants yet"}</div>
                </div>
              ) : (
                <div className="ap-list">
                  {filtered.map((p) => (
                    <button key={p._index} className="ap-row" onClick={() => { setSelected(p); setView("detail"); }}>
                      <img
                        className="ap-row-avatar"
                        src={p.photo || getProfileImage(p.id)}
                        alt=""
                        onError={(e) => { e.target.onerror = null; e.target.src = profileImage; }}
                      />
                      <div className="ap-row-main">
                        <div className="ap-row-name">{p.name_khmer || "—"}</div>
                        <div className="ap-row-sub">{p.name_latin || "—"} · {p.role || "—"}</div>
                      </div>
                      <div className="ap-row-org">{p.organization || "—"}</div>
                      <span className="ap-id-badge">{p.id}</span>
                      <span className="ap-chevron">›</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Detail card view (all info) ── */}
          {view === "detail" && selected && (
            <div className="ap-detail-card">
              <div className="ap-detail-banner" />
              <div className="ap-detail-avatar-wrap">
                <img
                  className="ap-detail-avatar"
                  src={selected.photo || getProfileImage(selected.id)}
                  alt=""
                  onError={(e) => { e.target.onerror = null; e.target.src = profileImage; }}
                />
              </div>
              <div className="ap-detail-name-block">
                <div className="ap-detail-name">{selected.name_khmer || "—"}</div>
                <div className="ap-detail-name-latin">{selected.name_latin || "—"}</div>
              </div>
              <div className="ap-detail-fields">
                <DetailField label="Participant ID" value={selected.id} />
                <DetailField label="Organization" value={selected.organization} />
                <DetailField label="Role" value={selected.role} />
                <DetailField label="Phone" value={selected.phone} />
                <DetailField label="Address" value={selected.address} />

                <div className="ap-detail-section-label">Emergency Contact</div>
                <DetailField label="Contact Name" value={selected.emergency_contact?.name} />
                <DetailField label="Relation" value={selected.emergency_contact?.relation} />
                <DetailField label="Contact Phone" value={selected.emergency_contact?.phone} />
              </div>
              <div className="ap-detail-actions">
                <button className="ap-btn ap-btn-ghost" onClick={() => setModal({ type: "edit", participant: selected })}>Edit</button>
                <button className="ap-btn ap-btn-danger" onClick={() => setModal({ type: "delete", participant: selected })}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "add" && <ParticipantModal mode="add" event={activeEvent} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "edit" && <ParticipantModal mode="edit" participant={modal.participant} event={activeEvent} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "delete" && (
        <ConfirmModal
          title="Delete Participant"
          body={<>You are about to permanently remove <span className="ap-confirm-name">{modal.participant.name_khmer}</span> ({modal.participant.id}) from Firebase.</>}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
      {modal?.type === "add-event" && <EventModal onClose={() => setModal(null)} onSave={handleEventAdded} />}
      {modal?.type === "delete-event" && (
        <ConfirmModal
          title="Delete Event"
          body={<>You are about to permanently remove the event <span className="ap-confirm-name">{modal.event}</span> and all of its participants from Firebase.</>}
          onClose={() => setModal(null)}
          onConfirm={handleDeleteEvent}
        />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}
