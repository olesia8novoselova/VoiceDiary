import { Link, useLocation } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaChartLine, FaBook } from "react-icons/fa";
import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header({ currentDay = 1, streakDays = 0, onCalendarToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/homepage";

  return (
    <header className={`sticky-header ${isHomePage ? "transparent" : ""}`}>
      <div className="header-content">
        {isHomePage ? (
          <div className="home-header-nav">
            <div className="nav-group left-group">
              <div 
                className="nav-box calendar" 
                onClick={() => onCalendarToggle()}
                title="Calendar"
              >
                <FaCalendarAlt className="icon" />
                <span className="nav-label">Calendar</span>
              </div>
              
              <div 
                className="nav-box profile" 
                onClick={() => navigate("/profile")}
                title="Profile"
              >
                <FaUser className="icon" />
                <span className="nav-label">Profile</span>
              </div>
            </div>

            <div className="nav-group right-group">
              <div 
                className="nav-box journal" 
                onClick={() => navigate("/journal")}
                title="Journal"
              >
                <FaBook className="icon" />
                <span className="nav-label">Journal</span>
              </div>
              
              <div className="nav-box progress" title="Progress">
                <div className="progress-content">
                  <FaChartLine className="icon" />
                  <span className="progress-text">Day {currentDay}</span>
                  {streakDays > 0 && (
                    <span className="streak-badge">{streakDays}🔥</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              <span className="login-text">Login</span>
              <FaUser className="login-icon" />
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;