import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useRegisterMutation,
  useLoginMutation,
} from "../features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setError } from "../features/auth/authSlice";
import "./AuthPage.css";
import AuthForm from "../features/auth/components/AuthForm";
import AuthToggle from "../features/auth/components/AuthToggle";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: authError, token } = useSelector((state) => state.auth);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const isLogin = location.pathname === "/login";

  useEffect(() => {
    if (token) {
      navigate("/homepage");
    }
  }, [token, navigate]);

  const toggleAuthMode = () => {
    navigate(isLogin ? "/signup" : "/login");
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const { data } = await login({
          login: formData.email,
          password: formData.password,
        }).unwrap();
        console.log("Login successful:", data);
        dispatch(setCredentials(data));
        navigate("/homepage");
      } else {
        console.log("Registration formData:", formData);
        const result = await register({
          login: formData.email,
          password: formData.password,
          nickname: formData.username,
        });
        console.log("Full registration result:", result);
        const { data } = result;
        console.log("Registration data:", data);
        dispatch(setCredentials(data));
        navigate("/homepage");
      }
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error data:", err.data);
      dispatch(setError(err.data?.error || "Authentication failed"));
    }
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
        <AuthForm
          isLogin={isLogin}
          onSubmit={handleSubmit}
          authError={authError}
        />
        <AuthToggle isLogin={isLogin} onToggle={toggleAuthMode} />
      </div>
      <div className="auth-right" />
    </div>
  );
}

export default AuthPage;
