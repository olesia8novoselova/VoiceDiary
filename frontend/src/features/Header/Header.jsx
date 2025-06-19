import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="sticky-header">
      <div className="header-content">
        <div className="auth-buttons">
          <a href="/login" className="login-btn">
            Login
          </a>
          <a href="/signup" className="signup-btn">
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;