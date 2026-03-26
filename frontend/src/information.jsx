// import { useState } from "react";
// import profileImg from "./assets/image_2026-03-20_08-01-04.png";

// const profileData = {
//   photo: profileImg,
//   nameKh: "រិន សុខា",
//   nameLatin: "RIN SOKHA",
//   from: "ថ្នាក់១",
//   role: "សិស្ស",
//   phone: "០១២ ៤៥៦ ៧៨៩",
//   address: "ផ្ទះលេខ ១២៣ ផ្លូវ ២៥៦ សង្កាត់ វត្តភ្នំ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ",
// };

// const otherData = {
//   name: "សម រិន",
//   role: "ឪពុក",
//   phone: "០១២ ៤៥៦ ៧៨៩",
// };

// const InfoField = ({ label, sublabel, value }) => (
//   <div className="info-field">
//     <div className="info-label">
//       {label}
//       {sublabel && <span className="info-sublabel"> / {sublabel}</span>}
//     </div>
//     <div className="info-value">{value}</div>
//   </div>
// );

// export default function ProfileCard() {
//   const [activeTab, setActiveTab] = useState("personal");

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Hanuman:wght@400;700;900&display=swap');

//         /* ── Reset & base ── */
//         *, *::before, *::after { box-sizing: border-box; }

//         .profile-page {
//           min-height: 100vh;
//           display: flex;
//           justify-content: center;
//           align-items: flex-start;
//           padding: 24px 16px 48px;
//           // background: linear-gradient(135deg, #e8f4fd 0%, #d0eaf8 50%, #c2e0f5 100%);
//           font-family: MiSansKhmer, sans-serif;
//         }

//         /* ── Card shell ── */
//         .profile-card {
//           width: 100%;
//           max-width: 480px;
//           background: #fff;
//           border-radius: 28px;
//           box-shadow: 0 16px 56px rgba(26, 141, 209, 0.18);
//           overflow: hidden;
//         }

//         /* ── Header banner ── */
//         .card-banner {
//           height: 12px;
//           background: linear-gradient(90deg, #b8e4f9, #1a8fd1, #0a1f6e);
//         }

//         /* ── Title block ── */
//         .card-title-block {
//           text-align: center;
//           padding: 20px 20px 0;
//         }
//         .card-title-main {
//           font-size: clamp(16px, 4vw, 22px);
//           font-weight: 800;
//           color: #1d88c7;
//           line-height: 1.35;
//           font-family: MiSansKhmer, sans-serif;
//         }
//         .card-title-sub {
//           font-size: clamp(12px, 2.8vw, 15px);
//           color: #8a8fa8;
//           margin-top: 4px;
//           font-family: 'Battambang', sans-serif;
//         }
//         .card-title-year {
//           font-size: clamp(14px, 3.2vw, 18px);
//           font-weight: 400;
//           color: #1d88c7;
//           margin-top: 2px;
//           font-family: 'Battambang', sans-serif;
//         }

//         /* ── Avatar ── */
//         .avatar-wrap {
//           display: flex;
//           justify-content: center;
//           padding: 16px 0 12px;
//         }
//         .avatar-circle {
//           width: clamp(140px, 40vw, 200px);
//           height: clamp(140px, 40vw, 200px);
//           border-radius: 50%;
//           border: 4px solid #fff;
//           box-shadow: 0 6px 24px rgba(26, 141, 209, 0.25);
//           overflow: hidden;
//           background: #3949ab;
//         }
//         .avatar-circle img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }

//         /* ── Tabs ── */
//         .tab-bar {
//           display: flex;
//           background: #f0f1f6;
//           border-radius: 20px;
//           padding: 4px;
//           margin: 0 16px 16px;
//         }
//         .tab-btn {
//           flex: 1;
//           padding: clamp(8px, 2vw, 11px) 0;
//           border-radius: 20px;
//           border: none;
//           cursor: pointer;
//           font-size: clamp(11px, 2.5vw, 13px);
//           font-weight: 700;
//           font-family: MiSansKhmer, sans-serif;
//           transition: all 0.25s ease;
//           background: transparent;
//           color: #8a8fa8;
//           box-shadow: none;
//         }
//         .tab-btn.active {
//           background: linear-gradient(135deg, #b8e4f9, #1a8fd1, #0a1f6e);
//           color: #fff;
//           box-shadow: 0 3px 12px rgba(26, 35, 126, 0.25);
//         }

//         /* ── Info fields ── */
//         .fields-wrap {
//           padding: 0 16px 32px;
//         }
//         .info-field {
//           background: #f7f8fa;
//           border-radius: 14px;
//           padding: clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 18px);
//           margin-bottom: 10px;
//           text-align: left;
//         }
//         .info-label {
//           font-size: clamp(10px, 2.2vw, 11px);
//           color: #8a8fa8;
//           margin-bottom: 4px;
//           letter-spacing: 0.03em;
//         }
//         .info-sublabel {
//           margin-left: 5px;
//           color: #b0b5c5;
//         }
//         .info-value {
//           font-size: clamp(14px, 3.5vw, 17px);
//           font-weight: 700;
//           color: #1a1d2e;
//           word-break: break-word;
//         }

//         /* ══════════════════════════════
//            BREAKPOINTS
//            ══════════════════════════════ */

//         /* Tiny phones (< 360px) */
//         @media (max-width: 359px) {
//           .profile-page { padding: 12px 8px 32px; }
//           .card-banner { height: 8px; }
//           .tab-bar { margin: 0 10px 12px; }
//           .fields-wrap { padding: 0 10px 24px; }
//         }

//         /* Phones (360–767px) — default styles above already cover this */

//         /* iPad / tablets (768px–1023px) */
//         @media (min-width: 768px) {
//           .profile-page {
//             padding: 48px 32px 64px;
//             align-items: center;
//           }
//           .profile-card {
//             max-width: 520px;
//             border-radius: 32px;
//           }
//           .card-title-main { font-size: 24px; }
//           .card-title-sub  { font-size: 15px; }
//           .card-title-year { font-size: 19px; }
//           .tab-bar { margin: 0 24px 20px; }
//           .fields-wrap { padding: 0 24px 40px; }
//           .info-field {
//             padding: 14px 20px;
//             margin-bottom: 12px;
//             border-radius: 16px;
//           }
//         }

//         /* Laptop (1024px–1439px) */
//         @media (min-width: 1024px) {
//           .profile-page {
//             padding: 64px 40px 80px;
//           }
//           .profile-card {
//             max-width: 480px;
//           }
//           .card-title-main { font-size: 23px; }
//           .info-value { font-size: 16px; }
//         }

//         /* Desktop / large screens (1440px+) */
//         @media (min-width: 1440px) {
//           .profile-page { padding: 80px 0; }
//           .profile-card {
//             max-width: 500px;
//             box-shadow: 0 24px 72px rgba(26, 141, 209, 0.20);
//           }
//           .card-title-main { font-size: 25px; margin: 30px 0px 0px}
//           .card-title-sub  { font-size: 16px; }
//           .card-title-year { font-size: 20px; }
//           .info-value { font-size: 17px; }
//           .tab-bar { margin: 0 28px 22px; }
//           .fields-wrap { padding: 0 28px 44px; }
//         }
//       `}</style>

//       <div className="profile-page">
//         <div className="profile-card">

//           {/* Top accent bar */}
//           <div className="card-banner" />

//           {/* Title */}
//           <div className="card-title-block">
//             <div className="card-title-main">កម្មវិធីប្រកួតប្រជែងកាំជ្រួចទឹក</div>
//             <div className="card-title-sub">Water Rocket Competition</div>
//             <div className="card-title-year">WRC 2026</div>
//           </div>

//           {/* Avatar */}
//           <div className="avatar-wrap">
//             <div className="avatar-circle">
//               <img src={profileData.photo} alt="Profile" />
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="tab-bar">
//             {[
//               { key: "personal", label: "ព័ត៌មានផ្ទាល់ខ្លួន" },
//               { key: "other",    label: "ព័ត៌មានផ្សេងៗ" },
//             ].map((tab) => (
//               <button
//                 key={tab.key}
//                 className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
//                 onClick={() => setActiveTab(tab.key)}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Fields */}
//           <div className="fields-wrap">
//             {activeTab === "personal" ? (
//               <>
//                 <InfoField label="ឈ្មោះ"       sublabel="NAME"    value={profileData.nameKh}    />
//                 <InfoField label="ឡាតាំង"       sublabel="LATIN"   value={profileData.nameLatin} />
//                 <InfoField label="មកពី"         sublabel="FROM"    value={profileData.from}       />
//                 <InfoField label="តួនាទី"        sublabel="ROLE"    value={profileData.role}       />
//                 <InfoField label="លេខទូរស័ព្ទ"   sublabel="PHONE"   value={profileData.phone}      />
//                 <InfoField label="អាសយដ្ឋាន"    sublabel="ADDRESS" value={profileData.address}    />
//               </>
//             ) : (
//               <>
//                 <InfoField label="ឈ្មោះ"       sublabel="NAME"  value={otherData.name}  />
//                 <InfoField label="ត្រូវជា"       sublabel="ROLE"  value={otherData.role}  />
//                 <InfoField label="លេខទូរស័ព្ទ"   sublabel="PHONE" value={otherData.phone} />
//               </>
//             )}
//           </div>

//             <div className="footer-copy">
//   © 2026 Water Rocket Competition. All rights reserved.
// </div>
//         </div>
//       </div>
//     </>
//   );
// }