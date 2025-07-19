import "./FilterControls.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback } from "react";

function FilterControls({
  dateFilter,
  limitFilter,
  onDateChange,
  onLimitChange,
}) {

  const handleDateChange = useCallback(
    (date) => {
      const formattedDate = date ? date.toISOString().split("T")[0] : "";
      onDateChange({ target: { value: formattedDate } });
    },
    [onDateChange]
  );

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
              placeholderText = "yyyy-MM-dd"
              className="custom-datepicker-input"
              popperClassName="custom-datepicker-popper"
              popperPlacement="bottom-start"
              showPopperArrow={false}
            />
          </div>
      </div>
      <div className="filter-group">
        <label htmlFor="limit-filter">Show last:</label>
        <div className="select-wrapper">
          <select 
            id="limit-filter" 
            value={limitFilter} 
            onChange={onLimitChange}
            className="custom-select"
          >
            <option value="0">All records</option>
            <option value="5">5 records</option>
            <option value="10">10 records</option>
            <option value="15">15 records</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterControls;