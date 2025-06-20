import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import  OnboardingPage from "./pages/OnboardingPage";
import  LoginPage from "./pages/LoginPage";
import  SignUpPage from "./pages/SignUpPage";



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
  <Route path="/" element={<Navigate to="/onboarding" />} />
  <Route path="/onboarding" element={<OnboardingPage />} />
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
   <Route path="/" element={<Navigate to="/signup" />} />
  <Route path="/signup" element={<SignUpPage />} />
</Routes>
        </main>
      </div>
    </Router>
  );
}