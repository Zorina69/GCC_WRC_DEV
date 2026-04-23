import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import "./Gallery.css";

export default function Gallery() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const gallery = [
    { id: 1, title: "Field Research 2025", category: "research", icon: "🏔️" },
    { id: 2, title: "Conference 2024", category: "event", icon: "🎤" },
    { id: 3, title: "Laboratory Work", category: "lab", icon: "🧪" },
    { id: 4, title: "Team Expedition", category: "research", icon: "🗺️" },
    { id: 5, title: "Member Meeting", category: "event", icon: "👥" },
    { id: 6, title: "Mineral Analysis", category: "lab", icon: "💎" },
    { id: 7, title: "Geological Survey", category: "research", icon: "📊" },
    { id: 8, title: "Award Ceremony", category: "event", icon: "🏆" },
    { id: 9, title: "Sediment Core", category: "lab", icon: "🧬" },
  ];

  const filteredGallery =
    selectedCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  return (
    <div className="gallery">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t("gallery")}</h1>
        <p>{t("exploreResearchActivities")}</p>
      </div>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            {[
              { key: "all", label: t("all") },
              { key: "research", label: t("research") },
              { key: "event", label: t("event") },
              { key: "lab", label: t("laboratory") },
            ].map((category) => (
              <button
                key={category.key}
                className={`filter-btn ${selectedCategory === category.key ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {filteredGallery.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-image-wrapper">
                  <div className="gallery-image">
                    <span className="gallery-icon">{item.icon}</span>
                  </div>
                  <div className="gallery-overlay">
                    <button className="btn-view">View</button>
                  </div>
                </div>
                <div className="gallery-info">
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="container">
          <h2 className="section-title">{t("featuredVideos")}</h2>
          <div className="video-grid">
            <div className="video-card">
              <div className="video-placeholder">
                <span>▶️</span>
              </div>
              <h3>Annual Conference Highlights 2024</h3>
              <p>Duration: 15:30 minutes</p>
            </div>
            <div className="video-card">
              <div className="video-placeholder">
                <span>▶️</span>
              </div>
              <h3>Field Research Documentary</h3>
              <p>Duration: 22:15 minutes</p>
            </div>
            <div className="video-card">
              <div className="video-placeholder">
                <span>▶️</span>
              </div>
              <h3>Meet Our Research Team</h3>
              <p>Duration: 8:45 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Collections */}
      <section className="collections-section">
        <div className="container">
          <h2 className="section-title">Photo Collections</h2>
          <div className="collections-grid">
            <div className="collection-card">
              <div className="collection-cover">📷</div>
              <h3>2025 Expeditions</h3>
              <p>45 Photos</p>
              <button className="btn-explore">Explore</button>
            </div>
            <div className="collection-card">
              <div className="collection-cover">🎓</div>
              <h3>2024 Events</h3>
              <p>128 Photos</p>
              <button className="btn-explore">Explore</button>
            </div>
            <div className="collection-card">
              <div className="collection-cover">🏅</div>
              <h3>Awards & Recognition</h3>
              <p>32 Photos</p>
              <button className="btn-explore">Explore</button>
            </div>
            <div className="collection-card">
              <div className="collection-cover">🌍</div>
              <h3>International Trips</h3>
              <p>67 Photos</p>
              <button className="btn-explore">Explore</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
