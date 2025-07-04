import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";
import "./Header.css";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Optional: Add API call to invalidate session on backend
  };

  return (
    <header className="sticky-header">
      <div className="header-content">
        <div className="auth-buttons">
          {user ? (
            <>
              <span className="welcome-message">Welcome, {user.nickname}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;