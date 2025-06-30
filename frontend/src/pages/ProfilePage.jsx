import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from "../features/calendar/components/MoodCalendar";
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/onboarding');
  };

  const handleBack = () => {
    navigate('/homepage');
  };

  const handleEditProfile = () => {
    navigate('/profile/settings'); 
  };

  return (
    <div className="profile-page">
      <div className="gradient-ball"></div>
      <div className="gradient-ball-2"></div>
      <div className="gradient-ball-3"></div>
      <a className="back-link" onClick={handleBack}>
        Back to Home
      </a>
      <div className="profile-container">
        <div className="profile-card">
          <div className="top-bar">
            <h1>Your Profile</h1>
            <button className="logout-button" onClick={handleLogout}>Log out</button>
          </div>

          <div className="profile-content">
            <div className="profile-main">
              <div className="profile-info">
                <img
    src="https://ui-avatars.com/api/?name=Dzhamila&background=672f94&color=fff"
    alt="User avatar"
    className="avatar"
  />
                <div className="profile-details">
                  <h2>Dzhamila</h2>
                  <p className="record-status">You haven't recorded anything</p>

                  <div className="info-field">
                    <label>Login</label>
                    <div className="input-value">dopoine@gmail.com</div>
                  </div>

                  <div className="info-field">
                    <label>Password</label>
                    <div className="input-value">******</div>
                  </div>

                  <button 
                    className="edit-button" 
                    onClick={handleEditProfile} 
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="calendar-section">
                <Calendar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;