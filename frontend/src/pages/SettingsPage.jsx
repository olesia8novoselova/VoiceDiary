import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useUpdateProfileMutation, useGetMeQuery } from '../features/auth/authApi';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  
  useGetMeQuery(undefined, { skip: !user });
  
  const [formData, setFormData] = useState({
    nickname: user?.Nickname || '',
    email: user?.Login || '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const updateData = {
        nickname: formData.nickname,
        ...(formData.newPassword && { password: formData.newPassword })
      };
      
      await updateProfile(updateData).unwrap();
      navigate('/profile');
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleBack = () => navigate('/profile');

  return (
    <div className="settings-page">
      <button
          className="back-button"
          onClick={() => navigate("/profile")}
          aria-label="Go back"
        >
          <svg
            width="30"
            height="30"
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
      
      <div className="settings-container">
        <div className="settings-header">
          <h1>Account Settings</h1>
          <p>Manage your profile information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="settings-card">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <img
                  src={`https://ui-avatars.com/api/?name=${formData.nickname || 'User'}&background=8b5cf6&color=fff`}
                  alt="Profile"
                  className="avatar"
                />
                <button 
                  type="button" 
                  className="avatar-edit-button"
                  onClick={() => alert('Avatar change functionality coming soon!')}
                >
                  Change Photo
                </button>
              </div>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="nickname">Full Name</label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;