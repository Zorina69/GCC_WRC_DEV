import { useTranslation } from "../hooks/useTranslation";
import "./About.css";

export default function About() {
  const { t } = useTranslation();

  const team = [
    {
      name: t("drSamuelChan"),
      position: t("president"),
      bio: t("drSamuelChanBio"),
    },
    {
      name: t("profMariaSokha"),
      position: t("vicePresident"),
      bio: t("profMariaSokhaBio"),
    },
    {
      name: t("engThearySrey"),
      position: t("researchDirector"),
      bio: t("engThearySreyBio"),
    },
    {
      name: t("drLinkhSophea"),
      position: t("secretaryGeneral"),
      bio: t("drLinkhSopheaBio"),
    },
  ];

  return (
    <div className="about">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t("aboutUs")}</h1>
        <p>{t("discoverOurStory")}</p>
      </div>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-box">
            <h2>{t("ourMission")}</h2>
            <p>{t("ourMissionDesc")}</p>
          </div>
          <div className="vision-box">
            <h2>{t("ourVision")}</h2>
            <p>{t("ourVisionDesc")}</p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="history">
        <div className="container">
          <h2 className="section-title">{t("ourHistory")}</h2>
          <div className="history-timeline">
            <div className="timeline-item">
              <div className="timeline-year">2001</div>
              <h3>{t("founded")}</h3>
              <p>{t("foundedDesc")}</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2008</div>
              <h3>{t("expansion")}</h3>
              <p>{t("expansionDesc")}</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2015</div>
              <h3>{t("research")}</h3>
              <p>{t("researchDesc")}</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <h3>{t("globalization")}</h3>
              <p>{t("globalizationDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="team">
        <div className="container">
          <h2 className="section-title">{t("leadershipTeam")}</h2>
          <div className="team-grid">
            {team.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-avatar">👤</div>
                <h3>{member.name}</h3>
                <p className="position">{member.position}</p>
                <p className="specialty">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact">
        <div className="container">
          <h2 className="section-title">{t("ourImpact")}</h2>
          <div className="impact-stats">
            <div className="impact-stat">
              <div className="stat-icon">📚</div>
              <h3>200+</h3>
              <p>{t("publications")}</p>
            </div>
            <div className="impact-stat">
              <div className="stat-icon">🌍</div>
              <h3>15+</h3>
              <p>{t("internationalPartners")}</p>
            </div>
            <div className="impact-stat">
              <div className="stat-icon">👥</div>
              <h3>500+</h3>
              <p>{t("activeMembers")}</p>
            </div>
            <div className="impact-stat">
              <div className="stat-icon">🏢</div>
              <h3>50+</h3>
              <p>{t("activeProjects")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values">
        <div className="container">
          <h2 className="section-title">{t("coreValues")}</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🔬</div>
              <h3>{t("excellence")}</h3>
              <p>{t("excellenceDesc")}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>{t("collaboration")}</h3>
              <p>{t("collaborationDesc")}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>{t("sustainability")}</h3>
              <p>{t("sustainabilityDesc")}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>{t("innovation")}</h3>
              <p>{t("innovationDesc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
