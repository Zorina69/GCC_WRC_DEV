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
        
        {/* Detail Page with Temporary ID in URL */}
        <Route path="/wrc/:tempId" element={<WrcProfile />} />

        {/* Optional: Redirect any unknown path to home */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/wrc/all-urls" element={<AllTempUrls />} />
      </Routes>
    </Router>
  );
}

export default App;