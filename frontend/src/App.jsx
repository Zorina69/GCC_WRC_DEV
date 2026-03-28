import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WrcList from "./wrcList";
import WrcProfile from "./wrcProfile";
import AllTempUrls from "./wrcAllurl";
import AdminPanel from "./AdminPanel";       // ← ADD this import
import MainPage from "./ESCmainpage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / List Page */}
        <Route path="/" element={<MainPage />} />

        {/* Home / List Page */}
        <Route path="/wrc" element={<WrcList />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />   {/* ← ADD this route */}

        {/* Must be BEFORE /wrc/:tempId */}
        <Route path="/wrc/all-urls" element={<AllTempUrls />} />

        {/* Detail Page with Temporary ID in URL */}
        <Route path="/wrc/:tempId" element={<WrcProfile />} />

        {/* Wildcard - always last */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;