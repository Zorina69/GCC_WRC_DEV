import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  return `${CLOUDINARY_BASE}/f_auto,q_auto/ID_${id}`;
};

export default function EscList() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/esc2026/`)
      .then((res) => res.json())
      .then((raw) => {
        // Firebase returns an object { "0": {...}, "1": {...} } or array
        // Normalize to a flat array either way
        const data = Array.isArray(raw)
          ? raw
          : Object.values(raw).flatMap((v) =>
              Array.isArray(v) ? v : Object.values(v)
            );
        setParticipants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("មិនអាចទាញទិន្នន័យបានទេ 😔");
        setLoading(false);
      });
  }, []);

  // Temp ID = "esc-ESC2601" using Firebase "id" field
  const getTempId = (person) => {
    return `esc-${person.id || ""}`;
  };

  // Search by Temp ID, Khmer name, or Latin name
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    const results = participants.filter((person) => {
      const tempId = getTempId(person).toLowerCase();
      const nameKh = (person.name_khmer || "").toLowerCase();
      const nameLatin = (person.name_latin || "").toLowerCase();
      const id = (person.id || "").toLowerCase();
      return (
        tempId.includes(term) ||
        nameKh.includes(term) ||
        nameLatin.includes(term) ||
        id.includes(term)
      );
    });

    setFilteredResults(results);
  }, [searchTerm, participants]);

  if (loading) {
    return (
      <div className="list-page">
        <div style={{ textAlign: "center", padding: "120px", color: "#2e7d32", fontSize: "22px" }}>
          កំពុងផ្ទុកទិន្នន័យ... 🌍
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-page" style={{ textAlign: "center", color: "red", padding: "100px" }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .list-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          padding: 40px 20px;
          font-family: 'Kantumruy Pro', sans-serif;
        }
        .container { max-width: 680px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 {
          font-size: clamp(22px, 5vw, 30px);
          color: #2e7d32;
          margin: 0 0 8px 0;
        }
        .header p { font-size: 17px; color: #1b5e20; }
        .card-title-main {
          font-size: clamp(16px, 4vw, 21px);
          font-weight: 800;
          color: #2e7d32;
        }
        .card-title-sub { font-size: clamp(12px, 2.8vw, 14px); color: #8a8fa8; margin-top: 4px; }
        .card-title-year { font-size: clamp(14px, 3.2vw, 18px); color: #2e7d32; margin-top: 2px; font-weight: 700; }


        .search-container { position: relative; margin-bottom: 30px; }
        .search-input {
          width: 100%;
          padding: 16px 20px 16px 52px;
          font-size: 16px;
          border: 2px solid #a5d6a7;
          border-radius: 50px;
          outline: none;
          font-family: 'Kantumruy Pro', sans-serif;
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: #2e7d32;
          box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.15);
        }
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
        }

        .results-list {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(46, 125, 50, 0.15);
          overflow: hidden;
        }
        .result-item {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          text-decoration: none;
          color: inherit;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.15s;
        }
        .result-item:hover { background: #f1f8f1; }
        .result-item:last-child { border-bottom: none; }

        .avatar-small {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #a5d6a7;
          background: #e8f5e9;
          flex-shrink: 0;
        }
        .result-info .name-kh { font-size: 18px; font-weight: 700; color: #1b5e20; }
        .result-info .name-latin { font-size: 14px; color: #2e7d32; }
        .result-info .temp-id { font-size: 11px; color: #888; font-family: monospace; margin-top: 2px; }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #666;
          background: white;
          border-radius: 20px;
        }
        .hint {
          text-align: center;
          padding: 80px 20px;
          color: #666;
          font-size: 16px;
        }
      `}</style>

      <div className="list-page">
        <div className="container">
          <div className="header">
            <div className="card-title-main">កម្មវិធីប្រកួតប្រជែងផែនដីវិទ្យា</div>
            <div className="card-title-sub">Earth Science Competition</div>
            <div className="card-title-year">លើកទី៦ ឆ្នាំ២០២៦</div>
            <div className="card-title-sub">ESC 2026</div>
          </div>

          <div className="search-container">
            <span className="search-icon">🔎</span>
            <input
              type="text"
              className="search-input"
              placeholder="ស្វែងរកតាម ID (ESC2601), ឈ្មោះខ្មែរ, ឬឡាតាំង..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {searchTerm.trim() ? (
            <div className="results-list">
              {filteredResults.length > 0 ? (
                filteredResults.map((person) => {
                  const tempId = getTempId(person);
                  const avatarSrc = person.photo || getProfileImage(person.id);
                  return (
                    <Link
                      key={person.id}
                      to={`/esc/esc2026/${tempId}`}
                      className="result-item"
                    >
                      <img
                        src={avatarSrc}
                        alt=""
                        className="avatar-small"
                        onError={(e) => {
                          e.target.src = "/esc2026_images/default.png";
                          e.target.onerror = null;
                        }}
                      />
                      <div className="result-info">
                        <div className="name-kh">
                          {person.name_khmer || "—"}
                        </div>
                        <div className="name-latin">
                          {person.name_latin || "—"}
                        </div>
                        <div className="temp-id">ID: {person.id}</div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="no-results">
                  រកមិនឃើញ "{searchTerm}" ទេ 😔
                </div>
              )}
            </div>
          ) : (
            <div className="hint">
              សូមវាយ ID ឬឈ្មោះ ដើម្បីស្វែងរក...
            </div>
          )}
        </div>
      </div>
    </>
  );
}