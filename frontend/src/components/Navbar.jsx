import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import logoclub from "/esc_logo.png";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";
import "./Navbar.css";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toggleLanguage, language } = useContext(LanguageContext);
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    // { path: "/", label: t("home") },
    // { path: "/about", label: t("about") },
    // { path: "/events", label: t("events") },
    // { path: "/results", label: t("results") },
    // { path: "/gallery", label: t("gallery") },
    // { path: "/contact", label: t("contact") },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src={logoclub} alt="Club Logo" className="navbar-logo-img" />
            <div className="navbar-logo-text">
              <span className="navbar-title">ក្លឹបធរណីវិទ្យាកម្ពុជា</span>
              <span className="navbar-subtitle">Geology Club, Cambodia</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="navbar-menu">
            {navItems.map((item) => (
              <li key={item.path} className="navbar-item">
                <Link
                  to={item.path}
                  className={`navbar-link ${isActive(item.path) ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-mobile-link ${isActive(item.path) ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
