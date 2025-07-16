import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useUpdateProfileMutation, useGetMeQuery } from '../features/auth/authApi';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { refetch } = useGetMeQuery();
  
  const [formData, setFormData] = useState({
    nickname: '',
    login: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.Nickname || '',
        login: user.Login || '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password should be at least 6 characters";
      } else if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword = "Add at least one uppercase letter";
      } else if (!/\d/.test(formData.newPassword)) {
        newErrors.newPassword = "Add at least one number";
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        nickname: formData.nickname,
        login: formData.login,
        ...(formData.newPassword && { password: formData.newPassword })
      };
      
      await updateProfile(updateData).unwrap();
      await refetch();
      navigate('/profile');
    } catch (err) {
      console.error("Failed to update profile:", err);
      let errorMessage = "Failed to update profile";
      if (err.data?.error?.includes("already in use")) {
        errorMessage = "This login is already taken";
      } else if (err.data?.error) {
        errorMessage = err.data.error;
      }
      alert(errorMessage);
    }
  };

  const handleBack = () => navigate('/profile');

  return (
    <div className="settings-page">
      <button
        className="back-button"
        onClick={handleBack}
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
                <label htmlFor="nickname">Nickname</label>
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
                <label htmlFor="login">Login</label>
                <input
                  id="login"
                  name="login"
                  type="email"
                  value={formData.login}
                  onChange={handleChange}
                  className="form-input"
                  required
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
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                />
                {errors.newPassword && (
                  <div className="error-message">
                    <span>{errors.newPassword}</span>
                  </div>
                )}
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
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && (
                  <div className="error-message">
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
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