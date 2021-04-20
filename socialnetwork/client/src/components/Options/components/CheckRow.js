import React from 'react';

function CheckRow({ label, ...props }) {
  return (
    <div className="option-row">
      <label>
        <input type="checkbox" {...props} />
        <span className="check-label">{label}</span>
      </label>
    </div>
  );
}

export default CheckRow;
