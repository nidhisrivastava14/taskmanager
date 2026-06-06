import React from 'react';

/**
 * Reusable Card Wrapper
 */
const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-sm dark:shadow-slate-950/20 p-5 transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
