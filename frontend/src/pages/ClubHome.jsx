import { Link } from "react-router-dom";
import logoclub from "/esc_logo.png";
import { useTranslation } from "../hooks/useTranslation";
import "./ClubHome.css";

export default function ClubHome() {
  const { t } = useTranslation();

  return (
    <div className="club-home coming-soon-page">
      {/* Hero Section - Coming Soon */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content coming-soon-content">
          
          <h1 className="hero-title">{t("clubName")}</h1>
          <p className="hero-subtitle">{t("clubNameEng")}</p>
          
          <div className="coming-soon-badge">🚧 COMING SOON 🚧</div>
          
          <h2 className="coming-soon-title">Website Under Construction</h2>
          <p className="coming-soon-message">
            We are working hard to bring you an amazing new experience.<br />
            Stay tuned — launching very soon!
          </p>

          <div className="hero-buttons">
            <Link to="/about" className="btn btn-primary">
              {t("learnMore")}
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              {t("getInTouch")}
            </Link>
          </div>
        </div>
      </section>

      {/* Optional: Simple Footer */}
      <footer className="footer">
        <div className="footer-bottom">
          <p>{t("copyrights")}</p>
        </div>
      </footer>
    </div>
  );
}