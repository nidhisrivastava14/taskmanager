import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, CheckSquare } from 'lucide-react';

/**
 * Navbar Organism
 * Sticky header with blur effects, theme switches, and session handles.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/85 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-xl text-white shadow-md shadow-indigo-500/10">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 bg-clip-text">
            Taskly
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          
          {/* User Profile Info */}
          {user && (
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Logged in as
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {user.name}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all duration-200 focus:outline-none"
            aria-label="Toggle theme mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Logout Action Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/15 border border-transparent hover:border-rose-200/30 dark:hover:border-rose-900/30 transition-all duration-200 focus:outline-none"
            aria-label="Logout session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
