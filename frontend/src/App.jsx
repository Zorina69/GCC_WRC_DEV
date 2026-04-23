import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import ClubHome from "./pages/ClubHome";
import About from "./pages/About";
import Events from "./pages/Events";
import Schedule from "./pages/Schedule";
import Results from "./pages/Results";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import WrcList from "./wrcList";
import WrcProfile from "./wrcProfile";
import AllTempUrls from "./wrcAllurl";
import AdminPanel from "./AdminPanel";
import MainPage from "./ESCmainpage";
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
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/results" element={<Results />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* WRC Pages (for backward compatibility) */}
          <Route path="/wrc" element={<WrcList />} />
          <Route path="/wrc/all-urls" element={<AllTempUrls />} />
          <Route path="/wrc/:tempId" element={<WrcProfile />} />

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