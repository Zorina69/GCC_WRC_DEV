import logoclub from "/esc_logo.png";
import "./escPage.css";

const LeafSvg = ({ style }) => (
  <svg className="cs-leaf" style={style} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M100,10 Q160,10 180,80 Q200,150 100,190 Q50,160 30,100 Q10,40 100,10Z" fill="#2e7d32" />
    <line x1="100" y1="10" x2="100" y2="190" stroke="#2e7d32" strokeWidth="2" />
    <line x1="100" y1="60" x2="150" y2="90" stroke="#2e7d32" strokeWidth="1" />
    <line x1="100" y1="90" x2="155" y2="115" stroke="#2e7d32" strokeWidth="1" />
    <line x1="100" y1="120" x2="145" y2="145" stroke="#2e7d32" strokeWidth="1" />
    <line x1="100" y1="60" x2="55" y2="85" stroke="#2e7d32" strokeWidth="1" />
    <line x1="100" y1="90" x2="48" y2="110" stroke="#2e7d32" strokeWidth="1" />
  </svg>
);

export default function Esc2026() {
  return (
    <div className="cs-root">
      <div className="cs-top-line" />
      <div className="cs-bottom-line" />

      <LeafSvg style={{ top: "-30px", right: "-40px", width: "280px", height: "280px" }} />
      <LeafSvg style={{ bottom: "-20px", left: "-50px", width: "240px", height: "240px", transform: "rotate(120deg)" }} />

      <div className="cs-content">
        <img
          src={logoclub}
          alt="ESC Logo"
          className="cs-logo"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "block";
          }}
        />
        <div className="cs-logo-fallback" style={{ display: "none" }}>🌍</div>

        <p className="cs-eyebrow">Earth Science Competition</p>
        <h1 className="cs-title-kh">កម្មវិធីប្រកួតប្រជែងផែនដីវិទ្យា</h1>
        <p className="cs-title-en">ESC</p>

        <div className="cs-divider">
          <div className="cs-divider-line" />
          <div className="cs-divider-gem" />
          <div className="cs-divider-line" />
        </div>

        <p className="cs-soon-kh">នឹងដំណើរការឆាប់ៗនេះ...</p>
        <p className="cs-soon-en">Will be operating soon</p>
      </div>

      <p className="cs-footer">© 2026 Geology Club, Cambodia. All rights reserved.</p>
    </div>
  );
}