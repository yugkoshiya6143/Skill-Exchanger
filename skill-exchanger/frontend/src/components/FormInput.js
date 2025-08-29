import React from 'react';

const FormInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error,
  rows,
  options = []
}) => {
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          className={`form-control ${error ? 'is-invalid' : ''}`}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows || 3}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          className={`form-select ${error ? 'is-invalid' : ''}`}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    );
  };

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;
