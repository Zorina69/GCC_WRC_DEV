import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function WrcList() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/wrc/")
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

  // Stable Temp ID generator (same as Profile)
  const generateTempId = (person) => {
    const id = String(person.id || person._id || person.studentId || person.no || "001").padStart(3, "0");
    return `wrc-WRC2026-${id}`;
  };

  // Search logic - Improved for Temp ID
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    const results = participants.filter((person) => {
      const tempId = generateTempId(person);
      // Check if typed text matches any part of the Temp ID
      return tempId.toLowerCase().includes(term) || term.includes(tempId.toLowerCase());
    });

    setFilteredResults(results);
  }, [searchTerm, participants]);

  if (loading) {
    return (
      <div className="list-page">
        <div style={{ textAlign: "center", padding: "120px", color: "#1d88c7", fontSize: "22px" }}>
          កំពុងផ្ទុកទិន្នន័យ... 🚀
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="list-page" style={{ textAlign: "center", color: "red" }}>{error}</div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanuman:wght@400;700;900&display=swap');
        
        .list-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8f4fd 0%, #d0eaf8 100%);
          padding: 40px 20px;
          font-family: 'Hanuman', sans-serif;
        }
        .container { max-width: 680px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: clamp(26px, 5vw, 34px); color: #1d88c7; margin: 0 0 8px 0; }
        .header p { font-size: 18px; color: #0a1f6e; }

        .search-container { position: relative; margin-bottom: 30px; }
        .search-input {
          width: 100%;
          padding: 16px 20px 16px 50px;
          font-size: 17px;
          border: 2px solid #b8e4f9;
          border-radius: 50px;
          outline: none;
        }
        .search-input:focus {
          border-color: #1d88c7;
          box-shadow: 0 0 0 4px rgba(29, 136, 199, 0.2);
        }
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          color: #1d88c7;
        }

        .results-list {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(26, 141, 209, 0.15);
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
        }
        .result-item:hover { background: #f8fbff; }
        .result-item:last-child { border-bottom: none; }

        .avatar-small {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #b8e4f9;
        }
        .result-info .name-kh { font-size: 18px; font-weight: 700; }
        .result-info .name-latin { font-size: 14px; color: #1d88c7; }
        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #666;
          background: white;
          border-radius: 20px;
        }
      `}</style>

      <div className="list-page">
        <div className="container">
          <div className="header">
            <h1>កម្មវិធីប្រកួតប្រជែងកាំជ្រួចទឹក</h1>
            <p>Water Rocket Competition 2026</p>
          </div>

          <div className="search-container">
            <span className="search-icon">🔎</span>
            <input
              type="text"
              className="search-input"
              placeholder="ស្វែងរកតាម Temp ID (ឧ. wrc-WRC2026-001)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {searchTerm.trim() ? (
            <div className="results-list">
              {filteredResults.length > 0 ? (
                filteredResults.map((person) => {
                  const tempId = generateTempId(person);
                  return (
                    <Link
                      key={person.id || person._id}
                      to={`/wrc/${tempId}`}
                      className="result-item"
                    >
                      <img
                        src={person.photo || "https://via.placeholder.com/55?text=WRC"}
                        alt=""
                        className="avatar-small"
                      />
                      <div className="result-info">
                        <div className="name-kh">{person.nameKh || person.name_kh || person.nameKhmer}</div>
                        <div className="name-latin">{person.nameLatin || person.name_latin}</div>
                        <small style={{ color: "#1d88c7" }}>Temp ID: {tempId}</small>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="no-results">
                  រកមិនឃើញ Temp ID "{searchTerm}" ទេ 😔
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#666", fontSize: "17px" }}>
              សូមវាយ Temp ID ដើម្បីស្វែងរកសិស្ស...
            </div>
          )}
        </div>
      </div>
    </>
  );
}