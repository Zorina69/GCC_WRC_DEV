import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import ClubHome from "./pages/ClubHome";
import About from "./pages/About";
import Events from "./pages/Events";
import Results from "./pages/Results";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdminPanel from "./AdminPanel";
import MainPage from "./ESCmainpage";
import EscList from "./esc/escList";
import EscAllUrls from "./esc/escAllurl";
import EscProfile from "./esc/escProfile";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Club Pages */}
          <Route path="/" element={<ClubHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/results" element={<Results />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* WRC Pages (for backward compatibility) */}
          {/* <Route path="/wrc" element={<WrcList />} />
          <Route path="/wrc/all-urls" element={<AllTempUrls />} />
          <Route path="/wrc/:tempId" element={<WrcProfile />} /> */}

          {/* ESC Pages */}
          <Route path="/esc2026" element={<EscList />} />
          <Route path="/esc2026/all-urls" element={<EscAllUrls/>} />
          <Route path="/esc2026/:tempId" element={<EscProfile />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Wildcard - always last */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;