import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import { CheckSquare, Lock, Mail, Sun, Moon } from 'lucide-react';

/**
 * Login Page Component
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login, isLoggedIn } = useAuth();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect immediately to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Show session expired message if redirected
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      addToast('Session expired, please login again', 'error');
    }
  }, [location.search, addToast]);

  // Handle validations
  const validate = (name, val) => {
    let errorMsg = '';
    if (name === 'email') {
      if (!val) {
        errorMsg = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)) {
        errorMsg = 'Please enter a valid email address';
      }
    } else if (name === 'password') {
      if (!val) {
        errorMsg = 'Password is required';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    
    if (touched[name]) {
      validate(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submitting
    const emailError = validate('email', email);
    const passwordError = validate('password', password);
    setTouched({ email: true, password: true });

    if (emailError || passwordError) return;

    setSubmitting(true);
    try {
      await login(email, password);
      addToast('Successfully logged in!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const serverError = err.response?.data?.error || 'Failed to authenticate. Please check your credentials.';
      addToast(serverError, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex items-center justify-center p-4 relative">
      
      {/* Floating theme switch */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main card panel */}
      <div className="w-full max-w-md animate-scaleIn">
        
        {/* Branding header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-2xl text-white shadow-xl shadow-indigo-500/10">
            <CheckSquare className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome to Taskly
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Sign in to manage your daily objectives smoothly.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              required
              disabled={submitting}
            />

            {/* Password Field */}
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              required
              disabled={submitting}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={submitting}
              className="w-full mt-2 font-semibold shadow-lg shadow-indigo-500/10"
            >
              Sign In
            </Button>
          </form>

          {/* Signup links */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
            >
              Create free account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
