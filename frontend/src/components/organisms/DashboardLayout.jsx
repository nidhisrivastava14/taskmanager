import React from 'react';
import Navbar from './Navbar';

/**
 * DashboardLayout Organism
 * General layout wrapper for all authenticated pages
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Taskly Inc. Built for technical evaluation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
