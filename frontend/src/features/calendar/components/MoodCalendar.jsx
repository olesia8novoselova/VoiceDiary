import React from 'react';
import './MoodCalendar.css';

const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const MoodCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); 
  const currentDate = today.getDate();

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

  return (
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
                  day === currentDate ? 'selected-day' :
                  day ? 'calendar-day' : 'empty-day'
                }
              >
                {day || ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
