import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AllTempUrls() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/esc2026/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setParticipants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("រកមិនឃើញព័ត៌មានទេ ធ្វើមិចទៅ 😔");
        setLoading(false);
      });
  }, []);

  // UUID from Supabase is used directly as Temp ID with "esc-" prefix
  const getTempId = (person) => {
    const uuid = person.id || person.uuid || "unknown";
    return `esc-${uuid}`;
  };

  const getFullUrl = (tempId) => {
    return `${window.location.origin}/esc/esc2026/${tempId}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontSize: "22px", color: "#2e7d32" }}>
        កំពុងផ្ទុកទិន្នន័យ... 🌍
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: "100px", color: "red" }}>{error}</div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;700&display=swap');
        body {
          font-family: 'Kantumruy Pro', sans-serif;
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container {
          max-width: 960px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 16px 50px rgba(46, 125, 50, 0.15);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(90deg, #2e7d32, #1b5e20);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 { margin: 0; font-size: 26px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 15px; }
        .url-list { padding: 20px; }
        .url-item {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          gap: 15px;
        }
        .url-item:last-child { border-bottom: none; }
        .name { flex: 1; font-weight: 700; font-size: 17px; color: #1b5e20; }
        .url {
          flex: 2;
          font-family: monospace;
          font-size: 13px;
          word-break: break-all;
          color: #2e7d32;
        }
        .url a { color: #2e7d32; text-decoration: none; }
        .url a:hover { text-decoration: underline; }
        .copy-btn {
          padding: 8px 14px;
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          white-space: nowrap;
        }
        .copy-btn:hover { background: #1b5e20; }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>🌍 All Temp URLs — ESC 2026</h1>
          <p>កម្មវិធីប្រកួតប្រជែងផែនដីវិទ្យា លើកទី៦ ឆ្នាំ២០២៦ ({participants.length} នាក់)</p>
        </div>

        <div className="url-list">
          {participants.map((person, index) => {
            const tempId = getTempId(person);
            const fullUrl = getFullUrl(tempId);

            return (
              <div key={index} className="url-item">
                <div className="name">
                  { person.name_khmer || "Unknown"}
                  <br />
                  <small style={{ color: "#666", fontWeight: "normal" }}>
                    {person.nameLatin || person.name_latin}
                  </small>
                </div>

                <div className="url">
                  <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                    {fullUrl}
                  </a>
                </div>

                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(fullUrl);
                    alert("✅ Copied!");
                  }}
                >
                  Copy
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          <Link to="/" style={{ color: "#2e7d32", textDecoration: "none" }}>
            ← Back to Search Page
          </Link>
        </div>
      </div>
    </>
  );
}