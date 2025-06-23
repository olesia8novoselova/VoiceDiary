import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import OnboardingPage from "./pages/OnboardingPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const [globalError, setGlobalError] = useState(null);

  return (
    <Router>
      <div className="app">
        <main className="app-content">
          {globalError && (
            <div className="global-error" role="alert">
              {globalError}
              <button onClick={() => setGlobalError(null)} aria-label="Close">
                ✕
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
