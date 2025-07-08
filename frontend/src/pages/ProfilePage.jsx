import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../features/auth/authApi";
import { logout } from "../features/auth/authSlice";
import Calendar from "../features/calendar/components/MoodCalendar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const response = await logoutApi().unwrap();
      console.log("Logout API response:", response);
      dispatch(logout());
      navigate("/onboarding", { state: { fromLogout: true } });
    } catch (err) {
      console.error("Logout failed:", {
        error: err,
        status: err.status,
        data: err.data,
        originalError: err.originalError,
      });
    }
  };

  return (
    <div className="profile-page">
      <button
          className="back-button"
          onClick={() => navigate("/homepage")}
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
      
      <div className="profile-content">
        <header className="profile-header">
          <h1>Profile</h1>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </header>

        <div className="profile-card">
          <div className="user-info">
            <img
              src="https://ui-avatars.com/api/?name=Dzhamila&background=672f94&color=fff"
              alt="User"
              className="avatar"
            />
            <div className="user-details">
              <h2>Dzhamila</h2>
              <p className="activity-status">Active today</p>
            </div>
          </div>

          <div className="profile-fields">
            <div className="field">
              <label>Email</label>
              <p>dopoine@gmail.com</p>
            </div>

            <div className="field">
              <label>Password</label>
              <p>••••••••</p>
            </div>

            <button
              className="edit-button"
              onClick={() => navigate("/profile/settings")}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="calendar-container">
          <h3>Your Mood Calendar</h3>
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
