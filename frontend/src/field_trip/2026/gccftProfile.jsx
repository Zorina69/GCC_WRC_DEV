import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import profileImage from "../../assets/default-profile.png";

// Match image path: /esc2026/ESC2026-001.png using "id" field
// const getProfileImage = (id) => {
//   if (!id) return profileImage;
//   return `/esc2026_images/ID ${id}.png`;
// };

const CLOUDINARY_BASE = "https://res.cloudinary.com/dcphqmybu/image/upload";

const getProfileImage = (id) => {
  if (!id) return profileImage;
  // Add auto format + quality optimization for free
  return `${CLOUDINARY_BASE}/f_auto,q_auto/${id}`;
};

const InfoField = ({ label, sublabel, value }) => {
  const displayValue = value && value !== "—" ? value : "មិនមានព័ត៌មាន";
  return (
    <div className="info-field">
      <div className="info-label">
        {label}
        {sublabel && <span className="info-sublabel"> / {sublabel}</span>}
      </div>
      <div className="info-value">{displayValue}</div>
    </div>
  );
};

export default function GccftProfile() {
  const { tempId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(profileImage);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    if (!tempId) {
      setError("Invalid link");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // tempId format: "gccft-GCCFT2601" → strip "gccft-" prefix to get the id
        const idFromUrl = tempId.startsWith("gccft-")
          ? tempId.slice(6)
          : tempId;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/gccft2026/${idFromUrl}`
        );
        if (!res.ok) throw new Error("Profile not found");

        const found = await res.json();
        setProfile(found);
      } catch (err) {
        console.error("Error finding profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [tempId]);

  // Load and cache image after profile is fetched
  useEffect(() => {
    if (!profile) return;
    const src = profile.photo || getProfileImage(profile.id);
    setImageSrc(src);
  }, [profile]);

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ textAlign: "center", padding: "120px 20px", color: "#2e7d32", fontSize: "22px" }}>
          កំពុងផ្ទុកព័ត៌មាន... 🌍
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div style={{ textAlign: "center", padding: "100px 20px", color: "#e74c3c" }}>
          <h2>រកមិនឃើញព័ត៌មានទេ ធ្វើមិចទៅ 😔</h2>
          <p>Temp ID: <strong>{tempId}</strong></p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "30px", padding: "12px 28px",
              background: "#2e7d32", color: "white",
              border: "none", borderRadius: "50px",
              cursor: "pointer", fontSize: "16px",
            }}
          >
            ← ត្រឡប់ទៅទំព័រដើម
          </button>
        </div>
      </div>
    );
  }

  const hasEmergencyContact =
    profile.emergency_contact &&
    (profile.emergency_contact.name || profile.emergency_contact.phone);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .profile-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px 16px 48px;
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          font-family: 'Kantumruy Pro', sans-serif;
        }
        .profile-card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 16px 56px rgba(46, 125, 50, 0.18);
          overflow: hidden;
        }
        .card-banner {
          height: 12px;
          background: linear-gradient(90deg, #f2db60, #f8fea1, #a7e9fe);
        }
        .card-title-block { text-align: center; padding: 20px 20px 0; }
        .card-title-main {
          font-size: clamp(16px, 4vw, 21px);
          font-weight: 800;
          color: #00000;
        }
        .card-title-sub { font-size: clamp(12px, 2.8vw, 14px); color: #8a8fa8; margin-top: 4px; }
        .card-title-year { font-size: clamp(14px, 3.2vw, 18px); color: #2e7d32; margin-top: 2px; font-weight: 700; }

        .avatar-wrap { display: flex; justify-content: center; padding: 16px 0 12px; }
        .avatar-circle {
          width: clamp(140px, 40vw, 200px);
          height: clamp(140px, 40vw, 200px);
          border-radius: 50%;
          border: 4px solid #fff;
          box-shadow: 0 6px 24px rgba(46, 125, 50, 0.25);
          overflow: hidden;
          background: #e8f5e9;
        }
        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }

        .fields-wrap { padding: 0 16px 8px; }
        .info-field {
          background: #f7f8fa;
          border-radius: 14px;
          padding: clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 18px);
          margin-bottom: 10px;
        }
        .info-label { font-size: clamp(10px, 2.2vw, 11px); color: #8a8fa8; margin-bottom: 4px; }
        .info-sublabel { margin-left: 5px; color: #b0b5c5; }
        .info-value { font-size: clamp(14px, 3.5vw, 17px); font-weight: 700; color: #1a1d2e; }

        .emergency-toggle-wrap {
          padding: 8px 16px 0;
          display: flex;
          justify-content: center;
        }
        .emergency-toggle-btn {
          width: 100%;
          padding: 14px 20px;
          background: ${showEmergency ? "#eeeeee" : "linear-gradient(135deg, #ef5350, #e53935)"};
          color: ${showEmergency ? "#555" : "#fff"};
          border: none;
          border-radius: 16px;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: clamp(13px, 3vw, 15px);
          font-weight: 700;
          cursor: pointer;
          box-shadow: ${showEmergency ? "none" : "0 6px 18px rgba(229, 57, 53, 0.3)"};
          transition: all 0.2s ease;
        }
        .emergency-toggle-btn:active { transform: scale(0.98); }

        .emergency-panel {
          padding: 12px 16px 0;
          animation: fadeIn 0.25s ease;
        }
        .emergency-panel .info-field {
          background: #fff3f3;
          border: 1px solid #ffd6d6;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .footer-copy {
          text-align: center;
          padding: 20px 16px 30px;
          color: #8a8fa8;
          font-size: 12px;
        }

        @media (min-width: 768px) {
          .profile-page { padding: 48px 32px 64px; align-items: center; }
          .profile-card { max-width: 520px; border-radius: 32px; }
        }
      `}</style>

      <div className="profile-page">
        <div className="profile-card">
          <div className="card-banner" />

          <div className="card-title-block">
            <div className="card-title-main">កម្មវិធីទស្សនកិច្ចសិក្សាស្រាវជ្រាវ​ ប្រចាំឆ្នាំ២០២៦</div>
            <div className="card-title-sub">GCC FIELD TRIP 2026</div>
          </div>

          <div className="avatar-wrap">
            <div className="avatar-circle">
              <img
                src={imageSrc}
                alt={profile.name_khmer || profile.name_latin || "Profile"}
                loading="eager"
                decoding="async"
                onError={() => setImageSrc(profileImage)}
              />
            </div>
          </div>

          <div className="fields-wrap">
            <InfoField label="លេខសំគាល់" sublabel="ID" value={profile.id || "—"} />
            <InfoField label="គោត្តនាម និងនាម" sublabel="FULL NAME" value={profile.name_khmer} />
            <InfoField label="ជាអក្សរឡាតាំង" sublabel="IN LATIN" value={profile.name_latin} />
            <InfoField label="ស្ថាប័ន" sublabel="INSTITUTION" value={profile.organization} />
            <InfoField label="តួនាទី" sublabel="ROLE" value={profile.role} />
            <InfoField label="លេខទូរស័ព្ទ" sublabel="PHONE NUMBER" value={profile.phone} />
            <InfoField label="អាសយដ្ឋាន" sublabel="ADDRESS" value={profile.address} />
          </div>

          {hasEmergencyContact && (
            <div className="emergency-toggle-wrap">
              <button
                className="emergency-toggle-btn"
                onClick={() => setShowEmergency((prev) => !prev)}
              >
                {showEmergency
                  ? "✕ បិទព័ត៌មានទំនាក់ទំនងបន្ទាន់"
                  : "🚨 មើលព័ត៌មានទំនាក់ទំនងបន្ទាន់ / Emergency Contact"}
              </button>
            </div>
          )}

          {hasEmergencyContact && showEmergency && (
            <div className="emergency-panel">
              <InfoField
                label="ឈ្មោះទំនាក់ទំនងបន្ទាន់"
                sublabel="EMERGENCY NAME"
                value={profile.emergency_contact.name}
              />
              <InfoField
                label="ទំនាក់ទំនង"
                sublabel="RELATION"
                value={profile.emergency_contact.relation}
              />
              <InfoField
                label="លេខទូរស័ព្ទបន្ទាន់"
                sublabel="EMERGENCY PHONE"
                value={profile.emergency_contact.phone}
              />
            </div>
          )}

          <div className="footer-copy">
            © 2026 GCC FIELD TRIP. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}