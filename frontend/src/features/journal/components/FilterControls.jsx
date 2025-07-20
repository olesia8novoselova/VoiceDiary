import "./FilterControls.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback } from "react";
import { useState, useRef, useEffect } from "react";

function CustomSelect({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find(opt => opt.value === value)?.label || "Select..."}
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map(option => (
            <li
              key={option.value}
              className={`dropdown-item ${value === option.value ? "selected" : ""}`}
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterControls({ dateFilter, limitFilter, onDateChange, onLimitChange }) {
  const handleDateChange = useCallback(
    (date) => {
      const formattedDate = date ? date.toISOString().split("T")[0] : "";
      onDateChange({ target: { value: formattedDate } });
    },
    [onDateChange]
  );

  const limitOptions = [
    { value: "0", label: "All records" },
    { value: "5", label: "5 records" },
    { value: "10", label: "10 records" },
    { value: "15", label: "15 records" },
  ];

  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="date-filter">Filter by date:</label>
        <div className="datepicker-wrapper">
          <DatePicker
            id="date-filter"
            selected={dateFilter ? new Date(dateFilter) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="yyyy-MM-dd"
            className="custom-datepicker-input"
            popperClassName="custom-datepicker-popper"
            popperPlacement="bottom-start"
            showPopperArrow={false}
          />
        </div>
      </div>
      <div className="filter-group">
        <label htmlFor="limit-filter">Show last:</label>
        <CustomSelect
          value={limitFilter}
          onChange={onLimitChange}
          options={limitOptions}
        />
      </div>
    </div>
  );
}
export default FilterControls;