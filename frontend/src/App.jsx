import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useState } from "react";
import  OnboardingPage from "./pages/OnboardingPage";
// import "./App.css";

export default function App() {
  const [globalError, setGlobalError] = useState(null);

  return (
    <Router>
      <div className="app">
        <main className="app-content">
          {globalError && (
            <div className="global-error" role="alert">
              {globalError}
              <button 
                onClick={() => setGlobalError(null)} 
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          )}
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}