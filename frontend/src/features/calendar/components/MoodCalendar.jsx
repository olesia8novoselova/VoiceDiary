import React, { useState } from 'react';
import './MoodCalendar.css';

const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const Calendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDate = today.getDate();

  const [selectedDay, setSelectedDay] = useState(currentDate);
  const [recommendation, setRecommendation] = useState("Click on a day to see your prompt");

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const monthName = today.toLocaleString('default', { month: 'long' });

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    // эт заглушка, будешь малая подключать сюда бэк:
    setRecommendation(`Recommendation for ${monthName} ${day}: Stay mindful and drink water 💧`);
  };

  return (
    
    <div className="calendar-full-wrapper">
         <div className="gradient-ball"></div>
      <div className="gradient-ball-2"></div>
      <div className="gradient-ball-3"></div>
      <div className="gradient-ball-4"></div>
      <div className="gradient-ball-5"></div>

      <div className="calendar">
        <div className="month">{monthName} {year}</div>
        <div className="calendar-grid">
          {dayNames.map((name) => (
            <div key={name} className="day-label">{name}</div>
          ))}
          {weeks.map((week, wIdx) => (
            <React.Fragment key={wIdx}>
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={
                    day === selectedDay
                      ? 'selected-day'
                      : day
                      ? 'calendar-day'
                      : 'empty-day'
                  }
                  onClick={() => handleDayClick(day)}
                >
                  {day || ''}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* тоже заглушка */}
      <div className="recommendation-box">
        <h3>Recommendation</h3>
        <p>{recommendation}</p>
      </div>
    </div>
  );
};

export default Calendar;
