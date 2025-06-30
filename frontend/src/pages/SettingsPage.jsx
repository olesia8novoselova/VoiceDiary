import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/profile');
  };

  const handleSave = () => {
    // эт надо ну сохранять и на бэк
    navigate('/profile');
  };

  return (
    <div className="profile-settings-page">
      <div className="gradient-ball"></div>
      <div className="gradient-ball-2"></div>
      <div className="gradient-ball-3"></div>
      <a className="back-link" onClick={handleBack}>
        Back to Profile
      </a>
      
      <div className="settings-container">
        <div className="settings-card">
          <div className="top-bar">
            <h1>Profile Settings</h1>
          </div>

          <div className="settings-content">
            <div className="settings-main">
              <div className="settings-info">
                <div className="avatar" />
                <div className="settings-details">
                  <h2>Edit Your Information</h2>
                  <p className="settings-status">Update your profile details</p>

                  <div className="settings-field">
                    <label>Name</label>
                    <input 
                      type="text" 
                      defaultValue="Dzhamila" 
                      className="settings-input"
                    />
                  </div>

                  <div className="settings-field">
                    <label>Email</label>
                    <input 
                      type="email" 
                      defaultValue="dopoine@gmail.com" 
                      className="settings-input"
                    />
                  </div>

                  <div className="settings-field">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password" 
                      className="settings-input"
                    />
                  </div>

                  <div className="settings-field">
                    <label>Confirm Password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm new password" 
                      className="settings-input"
                    />
                  </div>

                  <div className="settings-actions">
                    <button className="cancel-button" onClick={handleBack}>
                      Cancel
                    </button>
                    <button className="save-button" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;