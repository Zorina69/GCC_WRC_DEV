import { useRef } from "react";
import { Link } from "react-router-dom";
import logoclub from "/esc_logo.png";
import { useTranslation } from "../hooks/useTranslation";
import "./ClubHome.css";

export default function ClubHome() {
  const featuresRef = useRef(null);
  const { t } = useTranslation();

  const features = [
    {
      icon: "🌍",
      title: t("globalExcellence"),
      description: t("globalExcellenceDesc"),
    },
    {
      icon: "🎓",
      title: t("expertMembers"),
      description: t("expertMembersDesc"),
    },
    {
      icon: "🔬",
      title: t("innovation"),
      description: t("innovationDesc"),
    },
    {
      icon: "🤝",
      title: t("community"),
      description: t("communityDesc"),
    },
  ];

  return (
    <div className="club-home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <img src={logoclub} alt="Club Logo" className="hero-logo" />
          </div>
          <h1 className="hero-title">{t("clubName")}</h1>
          <p className="hero-subtitle">{t("clubNameEng")}</p>
          <p className="hero-tagline">{t("tagline")}</p>
          <div className="hero-buttons">
            <Link to="/about" className="btn btn-primary">
              {t("learnMore")}
            </Link>
            <Link to="/events" className="btn btn-secondary">
              {t("viewEvents")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">{t("members")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">{t("researchProjects")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">25</div>
            <div className="stat-label">{t("yearsOfExcellence")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15+</div>
            <div className="stat-label">{t("partnerships")}</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef}>
        <div className="features-container">
          <h2 className="section-title">{t("whyChooseUs")}</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links">
        <div className="quick-links-container">
          <h2 className="section-title">{t("quickAccess")}</h2>
          <div className="links-grid">
            <Link to="/schedule" className="quick-link-card">
              <div className="quick-link-icon">📅</div>
              <h3>{t("schedule")}</h3>
              <p>{t("upcomingEventsAndMeetings")}</p>
            </Link>
            <Link to="/events" className="quick-link-card">
              <div className="quick-link-icon">📋</div>
              <h3>{t("events")}</h3>
              <p>{t("researchActivitiesAndSeminars")}</p>
            </Link>
            <Link to="/results" className="quick-link-card">
              <div className="quick-link-icon">🏆</div>
              <h3>{t("results")}</h3>
              <p>{t("achievementsAndPublications")}</p>
            </Link>
            <Link to="/gallery" className="quick-link-card">
              <div className="quick-link-icon">🖼️</div>
              <h3>{t("gallery")}</h3>
              <p>{t("photoAndMediaArchive")}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="cta-content">
          <h2>{t("readyToJoinUs")}</h2>
          <p>{t("becomePartOf")}</p>
          <Link to="/contact" className="btn btn-cta">
            {t("getInTouch")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t("clubName")}</h3>
            <p>{t("advancingGeological")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("quickLinks")}</h4>
            <ul>
              <li><Link to="/about">{t("about")}</Link></li>
              <li><Link to="/events">{t("events")}</Link></li>
              <li><Link to="/contact">{t("contact")}</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t("contact")}</h4>
            <p>Email: info@geologyclubcambodia.org</p>
            <p>Phone: +855 (23) 123-4567</p>
            <p>Location: Phnom Penh, Cambodia</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t("copyrights")}</p>
        </div>
      </footer>
    </div>
  );
}
