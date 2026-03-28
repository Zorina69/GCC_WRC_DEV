// frontend/src/AdminPanel.jsx
import { useState, useEffect, useCallback } from "react";
import {
  fetchParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant,
} from "./lib/apiClient";

const EVENTS = ["WRC_2026", "WRC_2027", "WRC_2028"];
const ADMIN_PASSWORD = "1234";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

  html, body, #root {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
    overflow: hidden;
  }

  .ap-root *, .ap-root *::before, .ap-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ap-overlay *, .ap-overlay *::before, .ap-overlay *::after { box-sizing: border-box; }

  .ap-root {
    font-family: 'Barlow', sans-serif;
    background: #080a0f;
    color: #e8eaf0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── Login ── */
  .ap-login {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080a0f;
    background-image: radial-gradient(ellipse at 20% 50%, rgba(232,41,42,0.07) 0%, transparent 60%);
  }
  .ap-login-box {
    background: #11151e;
    border: 1px solid #1e2435;
    border-top: 3px solid #e8292a;
    border-radius: 8px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 360px;
    text-align: center;
  }
  .ap-login-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 2.5rem; font-weight: 900; letter-spacing: 4px; color: #e8292a; text-transform: uppercase; margin-bottom: 0.25rem; }
  .ap-login-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; color: #4b5568; margin-bottom: 2rem; }
  .ap-login-label { display: block; font-family: 'Barlow Condensed', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #4b5568; text-align: left; margin-bottom: 0.4rem; }
  .ap-login-input { width: 100%; background: #0d1018; border: 1px solid #1e2435; color: #e8eaf0; padding: 0.7rem 1rem; border-radius: 5px; font-family: 'Barlow', sans-serif; font-size: 1rem; outline: none; transition: border-color 0.15s; margin-bottom: 1.25rem; letter-spacing: 3px; }
  .ap-login-input:focus { border-color: #e8292a; }
  .ap-login-btn { width: 100%; background: #e8292a; color: #fff; border: none; padding: 0.75rem; border-radius: 5px; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: background 0.15s; }
  .ap-login-btn:hover { background: #c4191a; }
  .ap-login-err { color: #e8292a; font-size: 0.8rem; margin-top: 0.75rem; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 1px; }

  /* ── Header ── */
  .ap-header {
    background: #11151e;
    border-bottom: 2px solid #e8292a;
    height: 60px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    flex-shrink: 0;
    width: 100%;
  }
  .ap-header-left { display: flex; align-items: center; gap: 1rem; }
  .ap-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.4rem; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: #e8292a; }
  .ap-header-sep { width: 1px; height: 24px; background: #1e2435; }
  .ap-header-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #4b5568; }
  .ap-logout { background: none; border: 1px solid #1e2435; color: #4b5568; padding: 0.35rem 0.85rem; border-radius: 4px; font-family: 'Barlow Condensed', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.15s; }
  .ap-logout:hover { border-color: #e8292a; color: #e8292a; }

  /* ── Body (sidebar + main) ── */
  .ap-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    width: 100%;
    min-width: 0;
  }

  /* ── Sidebar ── */
  .ap-sidebar {
    width: 200px;
    min-width: 200px;
    background: #11151e;
    border-right: 1px solid #1e2435;
    padding: 1.5rem 0;
    flex-shrink: 0;
    overflow-y: auto;
  }
  .ap-sidebar-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #2d3748; padding: 0 1rem 0.6rem; }
  .ap-ev-btn { width: 100%; text-align: left; background: none; border: none; border-left: 3px solid transparent; padding: 0.65rem 1rem; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 0.95rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #4b5568; transition: all 0.15s; display: flex; align-items: center; gap: 0.5rem; }
  .ap-ev-btn:hover { color: #e8eaf0; background: #0d1018; }
  .ap-ev-btn.active { color: #e8292a; border-left-color: #e8292a; background: rgba(232,41,42,0.06); }
  .ap-ev-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  /* ── Main ── */
  .ap-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  /* ── Toolbar ── */
  .ap-toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #1e2435;
    background: #080a0f;
    flex-shrink: 0;
    flex-wrap: wrap;
  }
  .ap-toolbar-info { display: flex; flex-direction: column; gap: 0.1rem; margin-right: auto; }
  .ap-page-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.6rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #e8eaf0; line-height: 1; }
  .ap-page-title span { color: #e8292a; }
  .ap-page-count { font-family: 'Barlow Condensed', sans-serif; font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; color: #2d3748; }
  .ap-search { background: #11151e; border: 1px solid #1e2435; color: #e8eaf0; padding: 0.5rem 0.9rem; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.15s; width: 240px; }
  .ap-search:focus { border-color: #e8292a; }
  .ap-search::placeholder { color: #2d3748; }

  /* ── Buttons ── */
  .ap-btn { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 1rem; border: none; border-radius: 4px; font-family: 'Barlow Condensed', sans-serif; font-size: 0.85rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .ap-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .ap-btn-primary { background: #e8292a; color: #fff; }
  .ap-btn-primary:hover:not(:disabled) { background: #c4191a; }
  .ap-btn-ghost { background: #11151e; color: #e8eaf0; border: 1px solid #1e2435; }
  .ap-btn-ghost:hover:not(:disabled) { border-color: #e8292a; color: #e8292a; }
  .ap-btn-danger { background: rgba(232,41,42,0.08); color: #e8292a; border: 1px solid rgba(232,41,42,0.25); }
  .ap-btn-danger:hover:not(:disabled) { background: #e8292a; color: #fff; }
  .ap-btn-sm { padding: 0.28rem 0.6rem; font-size: 0.72rem; }

  /* ── Scroll area (table lives here) ── */
  .ap-scroll-area {
    flex: 1;
    overflow-x: auto;   /* horizontal scroll */
    overflow-y: auto;   /* vertical scroll */
    padding: 1.25rem 1.5rem;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Table ── */
  .ap-table-wrap {
    background: #11151e;
    border: 1px solid #1e2435;
    border-radius: 6px;
    overflow: visible;
    width: max-content;    /* expands to fit all columns, triggers parent scroll */
    min-width: 100%;       /* never shrinks below scroll area width */
  }
  .ap-table-wrap table { width: 100%; border-collapse: collapse; }
  .ap-table-wrap thead { background: #0d1018; position: sticky; top: 0; z-index: 2; }
  .ap-table-wrap th { padding: 0.65rem 1rem; text-align: left; font-family: 'Barlow Condensed', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #2d3748; border-bottom: 1px solid #1e2435; white-space: nowrap; }
  .ap-table-wrap td { padding: 0.75rem 1rem; font-size: 0.875rem; border-bottom: 1px solid #1a1f2e; color: #e8eaf0; vertical-align: middle; white-space: nowrap; }
  .ap-table-wrap tr:last-child td { border-bottom: none; }
  .ap-table-wrap tbody tr:hover td { background: rgba(255,255,255,0.015); }
  .ap-id-badge { font-family: 'Barlow Condensed', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; color: #e8292a; background: rgba(232,41,42,0.08); border: 1px solid rgba(232,41,42,0.2); padding: 0.15rem 0.5rem; border-radius: 3px; white-space: nowrap; }
  .ap-num { font-family: monospace; font-size: 0.72rem; color: #2d3748; }
  .ap-actions { display: flex; gap: 0.4rem; }
  .ap-muted { color: #2d3748; }
  .ap-khmer { font-size: 0.95rem; }

  /* ── Empty / Loading ── */
  .ap-empty { text-align: center; padding: 5rem 2rem; color: #2d3748; }
  .ap-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .ap-empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; letter-spacing: 2px; text-transform: uppercase; }
  .ap-loading { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 4rem; color: #2d3748; font-family: 'Barlow Condensed', sans-serif; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; }
  .ap-spinner { width: 18px; height: 18px; border: 2px solid #1e2435; border-top-color: #e8292a; border-radius: 50%; animation: ap-spin 0.6s linear infinite; }
  @keyframes ap-spin { to { transform: rotate(360deg); } }

  /* ── Modal ── */
  .ap-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 1rem; }
  .ap-modal { background: #11151e; border: 1px solid #1e2435; border-top: 3px solid #e8292a; border-radius: 8px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 1.75rem; animation: ap-slideup 0.2s ease; }
  @keyframes ap-slideup { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .ap-modal-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.25rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #e8eaf0; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid #1e2435; }
  .ap-modal-title span { color: #e8292a; }
  .ap-section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #2d3748; margin: 1.25rem 0 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
  .ap-section-label::after { content: ''; flex: 1; height: 1px; background: #1e2435; }
  .ap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .ap-grid-full { grid-column: 1 / -1; }
  .ap-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .ap-field label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #4b5568; }
  .ap-field input { background: #0d1018; border: 1px solid #1e2435; color: #e8eaf0; padding: 0.55rem 0.8rem; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.15s; width: 100%; }
  .ap-field input:focus { border-color: #e8292a; }
  .ap-field input::placeholder { color: #2d3748; }
  .ap-field input:disabled { opacity: 0.4; cursor: not-allowed; }
  .ap-field-hint { font-size: 0.68rem; color: #2d3748; font-style: italic; }
  .ap-field-required { color: #e8292a; }
  .ap-modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #1e2435; }
  .ap-inline-err { color: #e8292a; font-size: 0.78rem; margin-top: 0.75rem; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 1px; background: rgba(232,41,42,0.07); padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid rgba(232,41,42,0.2); }
  .ap-confirm-body { color: #4b5568; font-size: 0.9rem; line-height: 1.65; margin-bottom: 0.5rem; }
  .ap-confirm-name { color: #e8eaf0; font-weight: 600; }
  .ap-confirm-warning { background: rgba(232,41,42,0.07); border: 1px solid rgba(232,41,42,0.2); border-radius: 4px; padding: 0.6rem 0.75rem; font-size: 0.78rem; color: #e8292a; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 1px; margin-top: 0.75rem; }

  /* ── Toast ── */
  .ap-toast { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 999999; background: #11151e; border: 1px solid #1e2435; border-left: 3px solid #22c55e; border-radius: 5px; padding: 0.65rem 1.1rem; font-family: 'Barlow Condensed', sans-serif; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; color: #e8eaf0; animation: ap-toast-in 0.2s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
  .ap-toast.error { border-left-color: #e8292a; }
  @keyframes ap-toast-in { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return <div className={`ap-toast${type === "error" ? " error" : ""}`}>{msg}</div>;
}

// ─── Participant Modal ─────────────────────────────────────────────────────────
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
        <div className="ap-modal-title">
          {mode === "edit" ? <>Edit <span>Participant</span></> : <>Add <span>Participant</span></>}
        </div>

        <div className="ap-section-label">Basic Info</div>
        <div className="ap-grid">
          <div className="ap-field">
            <label>Participant ID <span className="ap-field-required">*</span></label>
            <input value={form.id} onChange={set("id")} placeholder="WRC2026-0xx" disabled={mode === "edit"} />
            {mode === "add" && <span className="ap-field-hint">e.g. WRC2026-168</span>}
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
function ConfirmModal({ participant, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && !deleting && onClose()}>
      <div className="ap-modal" style={{ maxWidth: 420 }}>
        <div className="ap-modal-title">Delete <span>Participant</span></div>
        <p className="ap-confirm-body">
          You are about to permanently remove <span className="ap-confirm-name">{participant.name_khmer}</span> ({participant.id}) from Firebase.
        </p>
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

// ─── Admin Panel ──────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [activeEvent, setActiveEvent] = useState(EVENTS[0]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const loadParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchParticipants(activeEvent);
      setParticipants(Array.isArray(data) ? data : []);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [activeEvent]);

  useEffect(() => { if (isAuth) loadParticipants(); }, [loadParticipants, isAuth]);

  const showToast = (msg, type = "ok") => setToast({ msg, type });

  const handleSave = async (msg) => { setModal(null); showToast(msg); await loadParticipants(); };

  const handleDelete = async () => {
    try {
      await deleteParticipant(activeEvent, modal.participant._index);
      setModal(null); showToast("Participant deleted"); loadParticipants();
    } catch (e) { setModal(null); showToast(e.message, "error"); }
  };

  const filtered = participants.filter((p) =>
    [p.id, p.name_khmer, p.name_latin, p.organization, p.role, p.address]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const formatLabel = (ev) => {
    const m = ev.match(/^([A-Z]+)_(\d+)$/);
    return m ? { prefix: m[1], year: m[2] } : { prefix: ev, year: "" };
  };

  // ── Login ──────────────────────────────────────
  if (!isAuth) {
    return (
      <>
        <style>{css}</style>
        <div className="ap-login">
          <div className="ap-login-box">
            <div className="ap-login-logo">WRC</div>
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

  // ── Main UI ────────────────────────────────────
  const { prefix, year } = formatLabel(activeEvent);

  return (
    <>
      <style>{css}</style>
      <div className="ap-root">

        {/* Header */}
        <header className="ap-header">
          <div className="ap-header-left">
            <div className="ap-logo">WRC Admin</div>
            <div className="ap-header-sep" />
            <div className="ap-header-title">Participant Management</div>
          </div>
          <button className="ap-logout" onClick={() => { setIsAuth(false); setPassword(""); }}>Sign Out</button>
        </header>

        {/* Body */}
        <div className="ap-body">

          {/* Sidebar */}
          <aside className="ap-sidebar">
            <div className="ap-sidebar-label">Events</div>
            {EVENTS.map((ev) => {
              const { prefix: p, year: y } = formatLabel(ev);
              return (
                <button key={ev} className={`ap-ev-btn${activeEvent === ev ? " active" : ""}`} onClick={() => { setActiveEvent(ev); setSearch(""); }}>
                  <span className="ap-ev-dot" />
                  {p} {y}
                </button>
              );
            })}
          </aside>

          {/* Main content */}
          <main className="ap-main">

            {/* Toolbar */}
            <div className="ap-toolbar">
              <div className="ap-toolbar-info">
                <div className="ap-page-title">{prefix} <span>{year}</span></div>
                {!loading && <div className="ap-page-count">{filtered.length} participant{filtered.length !== 1 ? "s" : ""}</div>}
              </div>
              <input className="ap-search" placeholder="Search ID, name, org…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ap-btn ap-btn-primary" onClick={() => setModal({ type: "add" })}>+ Add Participant</button>
            </div>

            {/* Scrollable table area */}
            <div className="ap-scroll-area">
              {loading ? (
                <div className="ap-loading"><div className="ap-spinner" /> Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="ap-empty">
                  <div className="ap-empty-icon">{search ? "🔍" : "👤"}</div>
                  <div className="ap-empty-title">{search ? "No results found" : "No participants yet"}</div>
                </div>
              ) : (
                <div className="ap-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name (Khmer)</th>
                        <th>Name (Latin)</th>
                        <th>Organization</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>EC Name</th>
                        <th>EC Relation</th>
                        <th>EC Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p, i) => (
                        <tr key={p._index}>
                          <td><span className="ap-num">{i + 1}</span></td>
                          <td><span className="ap-id-badge">{p.id}</span></td>
                          <td><span className="ap-khmer">{p.name_khmer || <span className="ap-muted">—</span>}</span></td>
                          <td>{p.name_latin || <span className="ap-muted">—</span>}</td>
                          <td>{p.organization || <span className="ap-muted">—</span>}</td>
                          <td>{p.role || <span className="ap-muted">—</span>}</td>
                          <td>{p.phone || <span className="ap-muted">—</span>}</td>
                          <td><span className="ap-khmer">{p.address || <span className="ap-muted">—</span>}</span></td>
                          <td>{p.emergency_contact?.name || <span className="ap-muted">—</span>}</td>
                          <td>{p.emergency_contact?.relation || <span className="ap-muted">—</span>}</td>
                          <td>{p.emergency_contact?.phone || <span className="ap-muted">—</span>}</td>
                          <td>
                            <div className="ap-actions">
                              <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={() => setModal({ type: "edit", participant: p })}>Edit</button>
                              <button className="ap-btn ap-btn-danger ap-btn-sm" onClick={() => setModal({ type: "delete", participant: p })}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals outside root */}
      {modal?.type === "add" && <ParticipantModal mode="add" event={activeEvent} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "edit" && <ParticipantModal mode="edit" participant={modal.participant} event={activeEvent} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "delete" && <ConfirmModal participant={modal.participant} onClose={() => setModal(null)} onConfirm={handleDelete} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}