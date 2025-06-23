import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthPage.css";
import AuthForm from "../features/auth/components/AuthForm";
import AuthToggle from "../features/auth/components/AuthToggle";

function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const toggleAuthMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    navigate(newMode ? "/login" : "/signup");
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
          onClick={() => navigate("/onboarding")}
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
        <h2 className={isLogin ? "login-title" : "signup-title"}>
          {isLogin ? "Sign in" : "Sign up"}
        </h2>
        <AuthForm isLogin={isLogin} onSubmit={handleSubmit} />
        <AuthToggle isLogin={isLogin} onToggle={toggleAuthMode} />
      </div>
      <div className="auth-right" />
    </div>
  );
}

export default AuthPage;
