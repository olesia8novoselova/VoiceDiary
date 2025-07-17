import "./FilterControls.css";

function FilterControls({
  dateFilter,
  limitFilter,
  onDateChange,
  onLimitChange,
}) {
  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="date-filter">Filter by date:</label>
        <input
          id="date-filter"
          type="date"
          value={dateFilter}
          onChange={onDateChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="limit-filter">Show last:</label>
        <select id="limit-filter" value={limitFilter} onChange={onLimitChange}>
          <option value="0">All records</option>
          <option value="5">5 records</option>
          <option value="10">10 records</option>
          <option value="15">15 records</option>
        </select>
      </div>
    </div>
  );
}

export default FilterControls;
