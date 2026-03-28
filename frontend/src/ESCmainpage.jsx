// frontend/src/wrcHome.jsx
import { useState } from "react";
import logoclub from "/esc_logo.png"
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

  .wrc-home * { box-sizing: border-box; margin: 0; padding: 0; }

  .wrc-home {
    min-height: 100vh;
    width: 100%;
    background: #dde8d8;
    background-image:
      radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.45) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 80%, rgba(180,200,170,0.4) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Outfit', sans-serif;
    padding: 2rem 1rem;
  }

  .wrc-card {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    animation: wrc-fadein 0.7s ease both;
  }
  @keyframes wrc-fadein { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

  /* Title */
  .wrc-title {
    font-family: 'Kantumruy Pro', sans-serif;
    font-size: 2.1rem;
    font-weight: 700;
    color: #1a3a2a;
    text-align: center;
    line-height: 1.35;
    margin-bottom: 0.5rem;
    animation: wrc-fadein 0.7s 0.1s ease both;
  }

  .wrc-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 400;
    color: #4a6a55;
    text-align: center;
    letter-spacing: 0.5px;
    margin-bottom: 2rem;
    animation: wrc-fadein 0.7s 0.2s ease both;
  }

  /* Logo circle */
  .wrc-logo-wrap {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 2.5rem;
    box-shadow:
      0 8px 32px rgba(30,70,40,0.18),
      0 2px 8px rgba(30,70,40,0.10);
    animation: wrc-fadein 0.7s 0.3s ease both;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .wrc-logo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .wrc-logo-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #c8ddc0, #a8c4a0);
    border-radius: 50%;
    color: #4a7a55;
    font-size: 0.75rem;
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-align: center;
    padding: 1rem;
  }

  /* Buttons */
  .wrc-buttons {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    animation: wrc-fadein 0.7s 0.4s ease both;
  }

  .wrc-btn {
    flex: 1;
    padding: 0.85rem 1rem;
    border-radius: 50px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .wrc-btn-dark {
    background: #1a3a2a;
    color: #fff;
    box-shadow: 0 4px 16px rgba(26,58,42,0.3);
  }
  .wrc-btn-dark:hover { background: #0f2a1a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,58,42,0.4); }
  .wrc-btn-dark:active { transform: translateY(0); }

  .wrc-btn-light {
    background: rgba(255,255,255,0.7);
    color: #1a3a2a;
    border: 1px solid rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 12px rgba(30,70,40,0.08);
  }
  .wrc-btn-light:hover { background: rgba(255,255,255,0.9); transform: translateY(-1px); }
  .wrc-btn-light:active { transform: translateY(0); }

  /* Coming Soon Modal */
  .wrc-cs-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,35,20,0.6);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
    animation: wrc-fadein 0.2s ease;
  }

  .wrc-cs-box {
    background: #f0f5ee;
    border-radius: 24px;
    padding: 2.5rem 2rem 2rem;
    max-width: 300px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(15,35,20,0.3);
    animation: wrc-cs-pop 0.25s ease;
  }
  @keyframes wrc-cs-pop { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  .wrc-cs-icon {
    font-size: 2.75rem;
    margin-bottom: 0.75rem;
    display: block;
  }

  .wrc-cs-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #1a3a2a;
    margin-bottom: 0.5rem;
  }

  .wrc-cs-desc {
    font-family: 'Outfit', sans-serif;
    font-size: 0.875rem;
    color: #5a7a65;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .wrc-cs-label {
    display: inline-block;
    font-family: 'Outfit', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4a7a55;
    background: rgba(74,122,85,0.1);
    border: 1px solid rgba(74,122,85,0.2);
    border-radius: 50px;
    padding: 0.3rem 0.9rem;
    margin-bottom: 1.5rem;
  }

  .wrc-cs-close {
    width: 100%;
    padding: 0.75rem;
    border-radius: 50px;
    background: #1a3a2a;
    color: #fff;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .wrc-cs-close:hover { background: #0f2a1a; }
`;

const BUTTONS = [
  { label: "Information",  icon: "📋" },
  { label: "Contact",      icon: "📞" },
  { label: "Schedule",     icon: "📅" },
  { label: "Results",      icon: "🏆" },
  { label: "Gallery",      icon: "🖼️" },
  { label: "Register",     icon: "✍️" },
];

// Show only first 2 as primary row, rest below — or just show all
// Based on screenshot: 2 buttons side by side
const PRIMARY_BUTTONS = BUTTONS.slice(0, 2);

export default function WrcHome() {
  const [popup, setPopup] = useState(null); // { label, icon }

  return (
    <>
      <style>{css}</style>
      <div className="wrc-home">
        <div className="wrc-card">

          {/* Title */}
          <h1 className="wrc-title">ក្លឹបធរណីវិទ្យា<br />កម្ពុជា</h1>
          <p className="wrc-subtitle">Geology Club, Cambodia</p>

          {/* Logo — replace src with your image path */}
          <div className="wrc-logo-wrap">
            <img src={logoclub} alt="Geology Club Logo" />
          </div>

          {/* Buttons */}
          <div className="wrc-buttons">
            {PRIMARY_BUTTONS.map((btn) => (
              <button
                key={btn.label}
                className={`wrc-btn ${btn.label === "Information" ? "wrc-btn-dark" : "wrc-btn-light"}`}
                onClick={() => setPopup(btn)}
              >
                {btn.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Coming Soon Popup */}
      {popup && (
        <div className="wrc-cs-overlay" onClick={(e) => e.target === e.currentTarget && setPopup(null)}>
          <div className="wrc-cs-box">
            <span className="wrc-cs-icon">{popup.icon}</span>
            <div className="wrc-cs-title">{popup.label}</div>
            <div className="wrc-cs-label">Coming Soon</div>
            <p className="wrc-cs-desc">
              This section is currently under development.<br />
              Please check back soon!
            </p>
            <button className="wrc-cs-close" onClick={() => setPopup(null)}>Got it</button>
          </div>
        </div>
      )}
    </>
  );
}