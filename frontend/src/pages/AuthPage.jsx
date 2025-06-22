import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import AuthForm from "../features/auth/components/AuthForm";
import AuthToggle from "../features/auth/components/AuthToggle";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Обработка отправки формы
  };

  return (
    <div className="auth">
      <div className="auth-left">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2>{isLogin ? "Sign in" : "Sign up"}</h2>
        <AuthForm isLogin={isLogin} onSubmit={handleSubmit} />
        <AuthToggle isLogin={isLogin} onToggle={toggleAuthMode} />
      </div>
      <div className="auth-right" />
    </div>
  );
}

export default AuthPage;
