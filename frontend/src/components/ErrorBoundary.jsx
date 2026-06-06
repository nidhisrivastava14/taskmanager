import React, { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './atoms/Button';

/**
 * Global React Error Boundary
 * Gracefully handles runtime component rendering crashes
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log details of the crash for local debugging
    console.error('ErrorBoundary caught an exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 text-center transition-colors duration-200">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-lg rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl mb-2">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We encountered a runtime crash. Try refreshing the page, or click below to return to the home screen.
            </p>
            {this.state.error && (
              <pre className="w-full mt-2 p-3 text-left text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/50 rounded-lg text-slate-600 dark:text-slate-400 font-mono overflow-auto max-h-36">
                {this.state.error.toString()}
              </pre>
            )}
            <Button
              onClick={this.handleReset}
              className="mt-2 w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset App State
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
