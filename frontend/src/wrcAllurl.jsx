import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AllTempUrls() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/wrc/`)
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
        setError("មិនអាចទាញទិន្នន័យបានទេ 😔");
        setLoading(false);
      });
  }, []);

  const generateTempId = (person) => {
    const id = person.id || person._id || person.studentId || "unknown";
    // You can make it more stable later if needed
    return `wrc-${String(id).padStart(6, "0")}-${Math.random().toString(36).substring(2, 8)}`;
  };

  const getFullUrl = (tempId) => {
    return `${window.location.origin}/wrc/${tempId}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontSize: "22px", color: "#1d88c7" }}>
        កំពុងផ្ទុកទិន្នន័យ... 🚀
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: "100px", color: "red" }}>{error}</div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanuman:wght@400;700;900&display=swap');
        body {
          font-family: 'Hanuman', sans-serif;
          background: linear-gradient(135deg, #e8f4fd 0%, #d0eaf8 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 16px 50px rgba(26, 141, 209, 0.15);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(90deg, #1d88c7, #0a1f6e);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 8px 0 0;
          opacity: 0.9;
        }
        .url-list {
          padding: 20px;
        }
        .url-item {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          gap: 15px;
        }
        .url-item:last-child {
          border-bottom: none;
        }
        .name {
          flex: 1;
          font-weight: 700;
          font-size: 17px;
        }
        .url {
          flex: 2;
          font-family: monospace;
          font-size: 14px;
          word-break: break-all;
          color: #1d88c7;
        }
        .copy-btn {
          padding: 8px 14px;
          background: #1d88c7;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }
        .copy-btn:hover {
          background: #166a9e;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>🔗 All Temporary URLs</h1>
          <p>Water Rocket Competition 2026 ({participants.length} members)</p>
        </div>

        <div className="url-list">
          {participants.map((person, index) => {
            const tempId = generateTempId(person);
            const fullUrl = getFullUrl(tempId);

            return (
              <div key={index} className="url-item">
                <div className="name">
                  {person.nameKh || person.name_khmer || person.nameKhmer || "Unknown"}
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
                    alert("✅ Copied to clipboard!");
                  }}
                >
                  Copy
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          <Link to="/" style={{ color: "#1d88c7", textDecoration: "none" }}>
            ← Back to Search Page
          </Link>
        </div>
      </div>
    </>
  );
}