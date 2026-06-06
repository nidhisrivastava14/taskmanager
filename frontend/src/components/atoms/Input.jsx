import React from 'react';

/**
 * Reusable Form Input Component
 */
const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${
          error
            ? 'border-red-500 dark:border-red-500/80 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-offset-slate-900'
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 mt-0.5 ml-1 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
