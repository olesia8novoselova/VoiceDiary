import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './MoodCalendar.css';
import DayPopup from './DayPopup';
import { MoodIcon } from './MoodIcon';
import { useGetTotalsQuery } from '../totalApi';
import { useSelector } from 'react-redux';

const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [dailyData, setDailyData] = useState({});
  
  const userId = useSelector(state => state.auth.user?.ID);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
  
  const { data: monthlyData } = useGetTotalsQuery(
    { userId, startDate, endDate },
    { skip: !userId }
  );

useEffect(() => {
  if (monthlyData) {
    const transformedData = {};
    if (Array.isArray(monthlyData)) {
      monthlyData.forEach(day => {
        const dayNumber = new Date(day.date).getDate();
        transformedData[dayNumber] = {
          mood: day.emotion,
          summary: day.summary
        };
      });
    }
    setDailyData(transformedData);
  }
}, [monthlyData]);

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const currentDayData = selectedDay ? dailyData[selectedDay] : null;

  return (
    <div className="calendar-wrapper">
      <div className="gradient-ball" />
      <div className="gradient-ball-2" />
      <div className="gradient-ball-3" />
      <div className="gradient-ball-4" />
      
      <div className="calendar-header">
        <div className="month-navigation">
          <button 
            onClick={() => changeMonth(-1)}
            className="nav-button"
          >
            <FaChevronLeft />
          </button>
          <h2>{monthName} {year}</h2>
          <button 
            onClick={() => changeMonth(1)}
            className="nav-button"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="day-names">
        {dayNames.map((name, i) => (
          <div key={i} className="day-name">{name}</div>
        ))}
      </div>

      <div className="days-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`day-cell ${day === selectedDay ? 'selected' : ''} ${
              dailyData[day] ? 'has-note' : ''
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day && (
              <span className="day-number">{day}</span>
            )}
            {dailyData[day] ? (
              <div className="mood-emoji-main">
                <MoodIcon mood={dailyData[day].mood} />
              </div>
            ) : day && (
              <div className="empty-day"></div>
            )}
          </div>
        ))}
      </div>

      <DayPopup 
        currentDayData={currentDayData}
        selectedDay={selectedDay}
        monthName={monthName}
        year={year}
      />
    </div>
  );
};

export default Calendar;