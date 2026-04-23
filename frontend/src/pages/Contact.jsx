import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import "./Contact.css";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: "📍",
      title: t("address"),
      details: [t("phnomPenh"), t("nearMuseum")],
    },
    {
      icon: "📞",
      title: t("phone"),
      details: ["+855 (23) 123-4567", "+855 (12) 345-6789"],
    },
    {
      icon: "📧",
      title: t("email"),
      details: ["info@geologyclubcambodia.org", "research@geologyclubcambodia.org"],
    },
    {
      icon: "🕐",
      title: t("officeHours"),
      details: [t("mondayFriday"), t("saturday")],
    },
  ];

  return (
    <div className="contact">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t("contactUs")}</h1>
        <p>{t("getInTouchWith")}</p>
      </div>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>{t("sendUsMessage")}</h2>
              {submitted && (
                <div className="success-message">
                  ✓ {t("thankYouMessage")}
                </div>
              )}
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>{t("fullName")}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t("yourFullName")}
                  />
                </div>
                <div className="form-group">
                  <label>{t("email")}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t("yourEmail")}
                  />
                </div>
                <div className="form-group">
                  <label>{t("phone")}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("yourPhone")}
                  />
                </div>
                <div className="form-group">
                  <label>{t("subject")}</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={t("whatIsThis")}
                  />
                </div>
                <div className="form-group">
                  <label>{t("message")}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={t("yourMessage")}
                    rows="5"
                  ></textarea>
                </div>
                <button type="submit" className="btn-submit">
                  {t("sendMessage")}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-wrapper">
              <h2>{t("contactInformation")}</h2>
              <div className="contact-info-grid">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="info-card">
                    <div className="info-icon">{info.icon}</div>
                    <h3>{info.title}</h3>
                    {info.details.map((detail, detailIdx) => (
                      <p key={detailIdx}>{detail}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">{t("findUs")}</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <p>Phnom Penh, Cambodia</p>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                Interactive map coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-section">
        <div className="container">
          <h2 className="section-title">{t("connectWithUs")}</h2>
          <div className="social-grid">
            <a href="#" className="social-card">
              <div className="social-icon">f</div>
              <h3>Facebook</h3>
              <p>@GeologyClubCambodia</p>
            </a>
            <a href="#" className="social-card">
              <div className="social-icon">🐦</div>
              <h3>Twitter</h3>
              <p>@GCCambodia</p>
            </a>
            <a href="#" className="social-card">
              <div className="social-icon">📷</div>
              <h3>Instagram</h3>
              <p>@geologyclubcambodia</p>
            </a>
            <a href="#" className="social-card">
              <div className="social-icon">💼</div>
              <h3>LinkedIn</h3>
              <p>Geology Club Cambodia</p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">{t("frequentlyAsked")}</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>{t("becomeAMember")}</h3>
              <p>{t("becomeAMemberDesc")}</p>
            </div>
            <div className="faq-item">
              <h3>{t("membershipFees")}</h3>
              <p>{t("membershipFeesDesc")}</p>
            </div>
            <div className="faq-item">
              <h3>{t("attendAsGuest")}</h3>
              <p>{t("attendAsGuestDesc")}</p>
            </div>
            <div className="faq-item">
              <h3>{t("submitResearch")}</h3>
              <p>{t("submitResearchDesc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
