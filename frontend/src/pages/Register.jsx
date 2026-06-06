import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import { CheckSquare, Sun, Moon } from 'lucide-react';

/**
 * Register Page Component
 */
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ label: '', color: '', percent: 0 });

  const { register, isLoggedIn } = useAuth();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Compute password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ label: '', color: '', percent: 0 });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = 'Weak';
    let color = 'bg-red-500';
    let percent = 20;

    if (score >= 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
      percent = 100;
    } else if (score >= 2) {
      label = 'Medium';
      color = 'bg-amber-500';
      percent = 60;
    }

    setPasswordStrength({ label, color, percent });
  }, [password]);

  // Validate fields
  const validate = (fieldName, val) => {
    let errorMsg = '';
    
    if (fieldName === 'name') {
      if (!val.trim()) errorMsg = 'Name is required';
    } else if (fieldName === 'email') {
      if (!val) {
        errorMsg = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)) {
        errorMsg = 'Please enter a valid email address';
      }
    } else if (fieldName === 'password') {
      if (!val) {
        errorMsg = 'Password is required';
      } else if (val.length < 6) {
        errorMsg = 'Password must be at least 6 characters';
      }
    } else if (fieldName === 'confirmPassword') {
      if (!val) {
        errorMsg = 'Please confirm your password';
      } else if (val !== password) {
        errorMsg = 'Passwords do not match';
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    if (fieldName === 'name') setName(value);
    if (fieldName === 'email') setEmail(value);
    if (fieldName === 'password') setPassword(value);
    if (fieldName === 'confirmPassword') setConfirmPassword(value);

    if (touched[fieldName]) {
      validate(fieldName, value);
    }
  };

  const handleBlur = (e) => {
    const { name: fieldName, value } = e.target;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validate(fieldName, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameErr = validate('name', name);
    const emailErr = validate('email', email);
    const passErr = validate('password', password);
    const confErr = validate('confirmPassword', confirmPassword);

    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (nameErr || emailErr || passErr || confErr) return;

    setSubmitting(true);
    try {
      await register(name, email, password, confirmPassword);
      addToast('Account created successfully! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      const serverError = err.response?.data?.error || 'Registration failed. Please try again.';
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

      {/* Register panel */}
      <div className="w-full max-w-md animate-scaleIn">
        
        {/* Branding header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-2xl text-white shadow-xl shadow-indigo-500/10">
            <CheckSquare className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Sign up for a free account to manage your workflows.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <Input
              label="Full Name"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              required
              disabled={submitting}
            />

            {/* Email */}
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

            {/* Password */}
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              required
              disabled={submitting}
            />

            {/* Password Strength Indicator */}
            {password && (
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>Password Strength</span>
                  <span className={
                    passwordStrength.label === 'Strong' ? 'text-emerald-500' :
                    passwordStrength.label === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                  }>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && errors.confirmPassword}
              required
              disabled={submitting}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={submitting}
              className="w-full mt-2 font-semibold shadow-lg shadow-indigo-500/10"
            >
              Sign Up
            </Button>
          </form>

          {/* Login links */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
            >
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
