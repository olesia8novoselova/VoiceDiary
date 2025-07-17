import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation, useGetMeQuery } from "../features/auth/authApi";
import { logout, selectCurrentUser } from "../features/auth/authSlice";
import Calendar from "../features/calendar/components/MoodCalendar";
import "./ProfilePage.css";
import { useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState("calendar");
  const [entries] = useState([
    { id: 1, date: "2023-10-01", mood: "Happy", note: "Good day" },
    { id: 2, date: "2023-10-02", mood: "Sad", note: "Meeting was tough" },
  ]);

  useGetMeQuery(undefined, { skip: !user });

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
              src={`https://ui-avatars.com/api/?name=${user?.Nickname || 'User'}&background=672f94&color=fff`}
              alt="User"
              className="avatar"
            />
            <div className="user-details">
              <h2>{user?.Nickname || 'User'}</h2>
              <p className="activity-status">Active today</p>
            </div>
          </div>

          <div className="profile-fields">
            <div className="field">
              <label>Email</label>
              <p>{user?.Login || 'No email'}</p>
            </div>

            <button
              className="edit-button"
              onClick={() => navigate("/profile/settings")}
            >
              Edit Profile
            </button>
          </div>
        </div>
        
        <div className="tabs">
          <button 
            className={activeTab === "calendar" ? "active" : ""}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
          <button 
            className={activeTab === "entries" ? "active" : ""}
            onClick={() => setActiveTab("entries")}
          >
            Entries
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === "calendar" ? (
            <div className="calendar-container">
              <h3>Your Mood Calendar</h3>
              <Calendar />
            </div>
          ) : (
            <div className="entries-grid">
              {entries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Mood:</strong> {entry.mood}</p>
                  {entry.note && <p><strong>Note:</strong> {entry.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;