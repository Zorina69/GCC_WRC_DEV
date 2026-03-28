import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import profileImage from "./assets/default-profile.png";

// ── Build image path from participant ID ──────────────────────────────────────
// Images should be in: frontend/public/images/WRC2026-001.jpg
// Change the folder path and extension below to match your setup
const getProfileImage = (id) => {
  if (!id) return profileImage;
  // Try jpg first — if you use png change to .png
  return `/images/${id}.png`;
};

const InfoField = ({ label, sublabel, value }) => {
  const displayValue =
    value && value !== "—" ? value : "None"; // 👈 fallback text

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


export default function WrcProfile() {
  const { tempId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [imgError, setImgError] = useState(false); // fallback if image missing

  useEffect(() => {
    if (!tempId) {
      setError("Invalid link");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/wrc/`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const allData = await res.json();

        const found = allData.find((person) => {
          const baseId = String(person.id || person._id || person.studentId || "");
          const generatedTemp = `wrc-${baseId.padStart(6, "0")}`;
          return (
            tempId === person.tempId ||
            tempId.includes(generatedTemp) ||
            generatedTemp.includes(tempId) ||
            tempId.includes(baseId) ||
            person.nameKh?.includes(tempId) ||
            person.nameLatin?.includes(tempId)
          );
        });

        if (!found) throw new Error("Profile not found");
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

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ textAlign: "center", padding: "120px 20px", color: "#1d88c7", fontSize: "22px" }}>
          កំពុងផ្ទុកព័ត៌មាន... 🚀
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div style={{ textAlign: "center", padding: "100px 20px", color: "#e74c3c" }}>
          <h2>រកមិនឃើញព័ត៌មានទេ 😔</h2>
          <p>Temp ID: <strong>{tempId}</strong></p>
          <button
            onClick={() => navigate("/")}
            style={{ marginTop: "30px", padding: "12px 28px", background: "#1d88c7", color: "white", border: "none", borderRadius: "50px", cursor: "pointer", fontSize: "16px" }}
          >
            ← ត្រឡប់ទៅទំព័រដើម
          </button>
        </div>
      </div>
    );
  }

  // ── Resolve profile image ─────────────────────────────────────────────────
  // Priority: 1) photo/image field from DB  2) /images/{id}.jpg  3) default
  const participantId = profile.id || profile._id || profile.studentId;
  const imageSrc = imgError
    ? profileImage
    : (profile.photo || profile.image || getProfileImage(participantId));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanuman:wght@400;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .profile-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px 16px 48px;
          font-family: 'Hanuman', sans-serif;
        }
        .profile-card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 16px 56px rgba(26, 141, 209, 0.18);
          overflow: hidden;
        }
        .card-banner { height: 12px; background: linear-gradient(90deg, #b8e4f9, #1a8fd1, #0a1f6e); }
        .card-title-block { text-align: center; padding: 20px 20px 0; }
        .card-title-main { font-size: clamp(16px, 4vw, 22px); font-weight: 800; color: #1d88c7; }
        .card-title-sub { font-size: clamp(12px, 2.8vw, 15px); color: #8a8fa8; margin-top: 4px; }
        .card-title-year { font-size: clamp(14px, 3.2vw, 18px); color: #1d88c7; margin-top: 2px; }
        .avatar-wrap { display: flex; justify-content: center; padding: 16px 0 12px; }
        .avatar-circle {
          width: clamp(140px, 40vw, 200px);
          height: clamp(140px, 40vw, 200px);
          border-radius: 50%;
          border: 4px solid #fff;
          box-shadow: 0 6px 24px rgba(26, 141, 209, 0.25);
          overflow: hidden;
          background: #f0f1f6;
        }
        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
        .tab-bar { display: flex; background: #f0f1f6; border-radius: 20px; padding: 4px; margin: 0 16px 16px; }
        .tab-btn {
          flex: 1; padding: clamp(8px, 2vw, 11px) 0; border-radius: 20px; border: none;
          cursor: pointer; font-size: clamp(11px, 2.5vw, 13px); font-weight: 700;
          background: transparent; color: #8a8fa8; font-family: 'Hanuman', sans-serif;
        }
        .tab-btn.active { background: linear-gradient(135deg, #b8e4f9, #1a8fd1, #0a1f6e); color: #fff; }
        .fields-wrap { padding: 0 16px 32px; }
        .info-field { background: #f7f8fa; border-radius: 14px; padding: clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 18px); margin-bottom: 10px; }
        .info-label { font-size: clamp(10px, 2.2vw, 11px); color: #8a8fa8; margin-bottom: 4px; }
        .info-sublabel { margin-left: 5px; color: #b0b5c5; }
        .info-value { font-size: clamp(14px, 3.5vw, 17px); font-weight: 700; color: #1a1d2e; }
        .footer-copy { text-align: center; padding: 20px 16px 30px; color: #8a8fa8; font-size: 12px; }

        @media (min-width: 768px) {
          .profile-page { padding: 48px 32px 64px; align-items: center; }
          .profile-card { max-width: 520px; border-radius: 32px; }
        }
      `}</style>

      <div className="profile-page">
        <div className="profile-card">
          <div className="card-banner" />

          <div className="card-title-block">
            <div className="card-title-main">កម្មវិធីប្រកួតប្រជែងកាំជ្រួចទឹក</div>
            <div className="card-title-sub">Water Rocket Competition</div>
            <div className="card-title-year">WRC 2026</div>
          </div>

          <div className="avatar-wrap">
            <div className="avatar-circle">
              <img
                src={imageSrc}
                alt={profile.nameKh || participantId || "Profile"}
                onError={() => setImgError(true)}
              />
            </div>
          </div>

          <div className="tab-bar">
            {[
              { key: "personal", label: "ព័ត៌មានផ្ទាល់ខ្លួន" },
              { key: "other",    label: "ព័ត៌មានផ្សេងៗ" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="fields-wrap">
            {activeTab === "personal" ? (
              <>
                <InfoField label="ឈ្មោះ"        sublabel="NAME"    value={profile.nameKh || profile.name_kh || profile.nameKhmer || profile.name_khmer} />
                <InfoField label="ឡាតាំង"       sublabel="LATIN"   value={profile.nameLatin || profile.name_latin} />
                <InfoField label="មកពី"          sublabel="FROM"    value={profile.from || profile.class || profile.organization} />
                <InfoField label="តួនាទី"        sublabel="ROLE"    value={profile.role} />
                <InfoField label="លេខទូរស័ព្ទ"   sublabel="PHONE"   value={profile.phone} />
                <InfoField label="អាសយដ្ឋាន"    sublabel="ADDRESS" value={profile.address} />
              </>
            ) : (
              <>
                <InfoField label="ឈ្មោះ"        sublabel="NAME"  value={profile.other?.name     || profile.emergency_contact?.name} />
                <InfoField label="ត្រូវជា"       sublabel="ROLE"  value={profile.other?.role     || profile.emergency_contact?.relation} />
                <InfoField label="លេខទូរស័ព្ទ"   sublabel="PHONE" value={profile.other?.phone    || profile.emergency_contact?.phone} />
              </>
            )}
          </div>

          <div className="footer-copy">
            © 2026 Water Rocket Competition. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}