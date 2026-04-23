import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import "./Events.css";

export default function Events() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");

  const events = [
    {
      id: 1,
      title: "Annual Geological Conference 2026",
      date: "May 15-17, 2026",
      location: "Phnom Penh Convention Center",
      category: "conference",
      description: "The premier annual gathering of geologists from Southeast Asia",
      attendees: "500+",
      image: "🎤",
    },
    {
      id: 2,
      title: "Field Research Expedition",
      date: "June 1-7, 2026",
      location: "Koh Kong Province",
      category: "research",
      description: "Geological survey and sediment sampling in coastal areas",
      attendees: "30",
      image: "🏔️",
    },
    {
      id: 3,
      title: "Mineralogy Workshop",
      date: "April 28, 2026",
      location: "Club Laboratory",
      category: "workshop",
      description: "Hands-on mineral identification and analysis techniques",
      attendees: "50",
      image: "💎",
    },
    {
      id: 4,
      title: "Seismic Safety Seminar",
      date: "May 5, 2026",
      location: "Online & In-person",
      category: "seminar",
      description: "Understanding earthquake hazards and building resilience",
      attendees: "200+",
      image: "🌊",
    },
    {
      id: 5,
      title: "Student Geology Challenge",
      date: "May 22, 2026",
      location: "University Campus",
      category: "competition",
      description: "Competitive event for geology students across Cambodia",
      attendees: "100+",
      image: "🏆",
    },
    {
      id: 6,
      title: "Member Social Networking",
      date: "April 25, 2026",
      location: "Club Headquarters",
      category: "social",
      description: "Casual gathering for members to network and share ideas",
      attendees: "80",
      image: "🤝",
    },
  ];

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.category === activeFilter);

  return (
    <div className="events">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t("eventsActivities")}</h1>
        <p>{t("joinUsExciting")}</p>
      </div>

      {/* Filter Tabs */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-tabs">
            {[
              { key: "all", label: t("all") },
              { key: "conference", label: t("conference") },
              { key: "research", label: t("research") },
              { key: "workshop", label: t("workshop") },
              { key: "seminar", label: t("seminar") },
              { key: "competition", label: t("competition") },
              { key: "social", label: t("social") },
            ].map((filter) => (
              <button
                key={filter.key}
                className={`filter-tab ${activeFilter === filter.key ? "active" : ""}`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="events-grid-section">
        <div className="container">
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-icon">{event.image}</div>
                  <span className="event-category">{event.category}</span>
                </div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">📅 {event.date}</p>
                <p className="event-location">📍 {event.location}</p>
                <p className="event-description">{event.description}</p>
                <div className="event-footer">
                  <span className="event-attendees">👥 {event.attendees}</span>
                  <button className="event-btn">{t("register")}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Highlight */}
      <section className="upcoming-highlight">
        <div className="container">
          <h2 className="section-title">{t("featuredEvent")}</h2>
          <div className="highlight-card">
            <div className="highlight-left">
              <div className="highlight-icon">🎤</div>
            </div>
            <div className="highlight-right">
              <h3>Annual Geological Conference 2026</h3>
              <p className="highlight-date">May 15-17, 2026</p>
              <p className="highlight-location">Phnom Penh Convention Center</p>
              <p className="highlight-description">
                Join us for the most significant geological event of the year! Network with
                leading geologists, attend cutting-edge research presentations, and participate
                in interactive workshops.
              </p>
              <div className="highlight-details">
                <div className="detail">
                  <strong>Expected Attendees:</strong> 500+
                </div>
                <div className="detail">
                  <strong>Sessions:</strong> 20+
                </div>
                <div className="detail">
                  <strong>International Speakers:</strong> 15+
                </div>
              </div>
              <button className="btn-register-main">Register Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
