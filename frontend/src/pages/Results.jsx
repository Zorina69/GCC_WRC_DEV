import { useTranslation } from "../hooks/useTranslation";
import "./Results.css";

export default function Results() {
  const { t } = useTranslation();
  const achievements = [
    {
      year: 2025,
      title: "Research Excellence Award",
      description: "Recognition for groundbreaking geological research in Southeast Asia",
      type: "award",
    },
    {
      year: 2024,
      title: "Published 25 Research Papers",
      description: "Peer-reviewed geological studies in international journals",
      type: "publication",
    },
    {
      year: 2024,
      title: "UNESCO World Heritage Documentation Project",
      description: "Geological assessment and documentation of 3 UNESCO World Heritage Sites",
      type: "project",
    },
    {
      year: 2023,
      title: "International Partnership Agreement",
      description: "Collaboration with 5 leading geological research institutions globally",
      type: "partnership",
    },
  ];

  const publications = [
    {
      title: "Seismic Hazard Assessment in Cambodia",
      authors: "Sorn et al.",
      year: 2025,
      journal: "Journal of Geological Research",
    },
    {
      title: "Mineralogical Analysis of Southeast Asian Deposits",
      authors: "Yong, Tan & Kim",
      year: 2024,
      journal: "International Geology Review",
    },
    {
      title: "Coastal Erosion Patterns in Cambodia",
      authors: "Tan et al.",
      year: 2024,
      journal: "Marine Geology Letters",
    },
    {
      title: "Groundwater Sustainability in Phnom Penh Basin",
      authors: "Kim et al.",
      year: 2023,
      journal: "Hydrogeology Journal",
    },
  ];

  return (
    <div className="results">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t("results")}</h1>
        <p>{t("celebratingResearchBreakthroughs")}</p>
      </div>

      {/* Key Achievements */}
      <section className="achievements-section">
        <div className="container">
          <h2 className="section-title">{t("majorAchievements")}</h2>
          <div className="achievements-timeline">
            {achievements.map((item, idx) => (
              <div key={idx} className="achievement-card">
                <div className="achievement-year">{item.year}</div>
                <div className="achievement-badge">{item.type}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="metrics-section">
        <div className="container">
          <h2 className="section-title">Our Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📚</div>
              <div className="metric-number">87</div>
              <p>Research Publications</p>
              <span className="metric-change">↑ 15% this year</span>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🌍</div>
              <div className="metric-number">18</div>
              <p>International Partnerships</p>
              <span className="metric-change">↑ 3 new partnerships</span>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🏆</div>
              <div className="metric-number">12</div>
              <p>Prestigious Awards</p>
              <span className="metric-change">↑ 2 recent awards</span>
            </div>
            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-number">520</div>
              <p>Active Members</p>
              <span className="metric-change">↑ 5% growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="publications-section">
        <div className="container">
          <h2 className="section-title">{t("recentPublications")}</h2>
          <div className="publications-list">
            {publications.map((pub, idx) => (
              <div key={idx} className="publication-card">
                <div className="publication-header">
                  <h3>{pub.title}</h3>
                  <span className="pub-year">{pub.year}</span>
                </div>
                <p className="pub-authors">
                  <strong>{t("authors")}:</strong> {pub.authors}
                </p>
                <p className="pub-journal">
                  <strong>{t("journal")}:</strong> {pub.journal}
                </p>
                <button className="btn-read">{t("readMore")}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Impact */}
      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">{t("researchImpact")}</h2>
          <div className="impact-boxes">
            <div className="impact-box">
              <div className="impact-icon">📖</div>
              <h3>Knowledge Creation</h3>
              <p>
                Our research contributes to the global understanding of geological
                processes and natural hazards.
              </p>
            </div>
            <div className="impact-box">
              <div className="impact-icon">🛡️</div>
              <h3>Hazard Mitigation</h3>
              <p>
                Providing critical data for earthquake and tsunami preparedness
                in Cambodia.
              </p>
            </div>
            <div className="impact-box">
              <div className="impact-icon">🌱</div>
              <h3>Environmental Conservation</h3>
              <p>
                Supporting sustainable development and protection of natural
                resources.
              </p>
            </div>
            <div className="impact-box">
              <div className="impact-icon">🎓</div>
              <h3>Education & Training</h3>
              <p>
                Mentoring young scientists and advancing geological education
                nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
