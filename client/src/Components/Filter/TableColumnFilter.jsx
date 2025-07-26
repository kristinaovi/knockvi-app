// components/TableColumnFilter.jsx
import React from 'react';

const TableColumnFilter = ({ filters, setFilters }) => {
  return (
    <div className="w-100">
      <div className="row">
        {Object.keys(filters).map((key) => (
          <div className="col mb-2" key={key}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={`Filter ${key.toUpperCase()}`}
              value={filters[key]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableColumnFilter;
