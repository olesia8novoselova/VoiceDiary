import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate('/profile');
  const handleSave = () => navigate('/profile');

  return (
    <div className="settings-page">
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>
      
      <div className="settings-container">
        <div className="settings-header">
          <h1>Account Settings</h1>
          <p>Manage your profile information</p>
        </div>

        <div className="settings-card">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img
                src="https://ui-avatars.com/api/?name=Dzhamila&background=8b5cf6&color=fff"
                alt="Profile"
                className="avatar"
              />
              <button className="avatar-edit-button">
                Change Photo
              </button>
            </div>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                defaultValue="Dzhamila"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                defaultValue="dopoine@gmail.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button className="cancel-btn" onClick={handleBack}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;