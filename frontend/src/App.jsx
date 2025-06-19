import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import  OnboardingPage from "./pages/OnboardingPage";
import LoginPage from './pages/LoginPage';


import "./App.css";

export default function App() {
  const [globalError, setGlobalError] = useState(null);

  return (
    <Router>
      <div className="app" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <main className="app-content">
          {globalError && (
            <div className="global-error" role="alert">
              {globalError}
              <button 
                onClick={() => setGlobalError(null)} 
                aria-label="Close"
              >
                
              </button>
            </div>
          )}
          <Routes>
  <Route path="/" element={<Navigate to="/onboarding" replace />} />
  <Route path="/onboarding" element={<OnboardingPage />} />  
  <Route path="/login" element={<LoginPage />} />

 
  
</Routes>
        </main>
      </div>
    </Router>
  );
}