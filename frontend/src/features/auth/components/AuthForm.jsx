import { useState, useEffect, useCallback } from "react";
import "./Auth.css";
import ErrorIcon from "./ErrorIcon";
import HintIcon from "./HintIcon";
import PasswordInput from "./PasswordInput";

const AuthForm = ({ isLogin, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email (e.g., user@example.com)";
    }

    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username should be at least 3 characters";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Add at least one uppercase letter";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Add at least one number";
    }

    if (!isLogin) {
      if (!formData.repeatPassword) {
        newErrors.repeatPassword = "Please confirm your password";
      } else if (formData.password !== formData.repeatPassword) {
        newErrors.repeatPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [validateForm, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit(e);
    } else {
      setTimeout(() => {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const element = document.querySelector(`[name="${firstError}"]`);
          if (element) {
            window.scrollTo({
              top: element.offsetTop - 100,
              behavior: "smooth",
            });
          }
        }
      }, 50);
    }
  };

  const hasError = (field) => touched[field] && errors[field];

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className={`form-group ${hasError("email") ? "has-error" : ""}`}>
        <label htmlFor="email">Your email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={hasError("email") ? "error" : ""}
          aria-describedby={hasError("email") ? "email-error" : undefined}
        />
        {hasError("email") && (
          <div id="email-error" className="error-message">
            <ErrorIcon />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {!isLogin && (
        <div
          className={`form-group ${hasError("username") ? "has-error" : ""}`}
        >
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={hasError("username") ? "error" : ""}
            aria-describedby={
              hasError("username") ? "username-error" : undefined
            }
          />
          {hasError("username") && (
            <div id="username-error" className="error-message">
              <ErrorIcon />
              <span>{errors.username}</span>
            </div>
          )}
        </div>
      )}

      <div className={`form-group ${hasError("password") ? "has-error" : ""}`}>
        <label htmlFor="password">Password</label>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter your password"
          showPassword={showPassword}
          togglePasswordVisibility={() => setShowPassword(!showPassword)}
          hasError={hasError("password")}
          errorId="password-error"
        />
        {hasError("password") ? (
          <div id="password-error" className="error-message">
            <ErrorIcon />
            <span>{errors.password}</span>
          </div>
        ) : (
          !isLogin && (
            <div className="password-hint">
              <HintIcon />
              <span>
                At least 6 characters with one number and uppercase letter
              </span>
            </div>
          )
        )}
      </div>

      {!isLogin && (
        <div
          className={`form-group ${
            hasError("repeatPassword") ? "has-error" : ""
          }`}
        >
          <label htmlFor="repeatPassword">Repeat password</label>
          <PasswordInput
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Repeat your password"
            showPassword={showRepeatPassword}
            togglePasswordVisibility={() =>
              setShowRepeatPassword(!showRepeatPassword)
            }
            hasError={hasError("repeatPassword")}
            errorId="repeatPassword-error"
          />
          {hasError("repeatPassword") && (
            <div id="repeatPassword-error" className="error-message">
              <ErrorIcon />
              <span>{errors.repeatPassword}</span>
            </div>
          )}
        </div>
      )}

      <button type="submit" className="auth-submit-btn">
        {isLogin ? "Sign in" : "Sign up"}
      </button>
    </form>
  );
};

export default AuthForm;
