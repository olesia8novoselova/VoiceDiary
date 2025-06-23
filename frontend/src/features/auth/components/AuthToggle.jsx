import React from 'react';
import './Auth.css';

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <p className="auth-toggle-text">
      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
      <button 
        type="button" 
        onClick={onToggle} 
        className="auth-toggle-btn"
      >
        {isLogin ? "Sign up" : "Sign in"}
      </button>
    </p>
  );
};

export default AuthToggle;