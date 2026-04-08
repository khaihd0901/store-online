import React from "react";

const CustomerInput = ({
  type,
  value,
  label,
  minLength,
  maxLength,
  min,
  max,
  i_id,
  i_class,
  onChange,
  onBlur,
}) => {
  return (
    <div className="flex flex-col">
      <label className="py-1 font-medium capitalize" htmlFor={label}>
        {label}
      </label>
      <input
        id={i_id}
        type={type}
        value={value}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={`Enter ${label}`}
        className={i_class}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default CustomerInput;
