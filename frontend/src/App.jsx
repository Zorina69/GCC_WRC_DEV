import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WrcList from "./wrcList";           // ← List of all participants
import WrcProfile from "./wrcProfile";     // ← Detail page (the beautiful card you like)
import AllTempUrls from "./wrcAllurl";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / List Page */}
        <Route path="/" element={<WrcList />} />

        {/* ✅ Must be BEFORE /wrc/:tempId */}
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