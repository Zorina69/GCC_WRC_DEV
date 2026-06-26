import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function EscList() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/esc2026/`)
      .then((res) => res.json())
      .then((data) => {
        setParticipants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("មិនអាចទាញទិន្នន័យបានទេ 😔");
        setLoading(false);
      });
  }, []);

  // UUID from Supabase used directly as Temp ID with "esc-" prefix
  const getTempId = (person) => {
    const uuid = person.id || person.uuid || "";
    return `esc-${uuid}`;
  };

  // Search by Temp ID (UUID) or name
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    const results = participants.filter((person) => {
      const tempId = getTempId(person).toLowerCase();
      const nameKh = (person.nameKh || person.name_kh || person.nameKhmer || "").toLowerCase();
      const nameLatin = (person.nameLatin || person.name_latin || "").toLowerCase();
      return (
        tempId.includes(term) ||
        nameKh.includes(term) ||
        nameLatin.includes(term)
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

        .search-container { position: relative; margin-bottom: 30px; }
        .search-input {
          width: 100%;
          padding: 16px 20px 16px 52px;
          font-size: 16px;
          border: 2px solid #a5d6a7;
          border-radius: 50px;
          outline: none;
          font-family: 'Kantumruy Pro', sans-serif;
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
            <h1>🌍 កម្មវិធីប្រកួតប្រជែងផែនដីវិទ្យា</h1>
            <p>Earth Science Competition — ESC 2026</p>
          </div>

          <div className="search-container">
            <span className="search-icon">🔎</span>
            <input
              type="text"
              className="search-input"
              placeholder="ស្វែងរកតាម Temp ID, ឈ្មោះ..."
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
                  return (
                    <Link
                      key={person.id || person.uuid}
                      to={`/esc2026/${tempId}`}
                      className="result-item"
                    >
                      <img
                        src={person.photo || `/esc2026/${person.id || person.uuid}.png`}
                        alt=""
                        className="avatar-small"
                        onError={(e) => { e.target.style.opacity = "0.3"; }}
                      />
                      <div className="result-info">
                        <div className="name-kh">
                          {person.nameKh || person.name_kh || person.nameKhmer || "—"}
                        </div>
                        <div className="name-latin">
                          {person.nameLatin || person.name_latin || "—"}
                        </div>
                        <div className="temp-id">ID: {tempId}</div>
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
              សូមវាយ Temp ID ឬឈ្មោះ ដើម្បីស្វែងរក...
            </div>
          )}
        </div>
      </div>
    </>
  );
}