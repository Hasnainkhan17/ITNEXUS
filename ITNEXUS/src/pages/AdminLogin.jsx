import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertTriangle, Key, ArrowLeft, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';
import useSeo from '../utils/useSeo';

export default function AdminLogin() {
  useSeo({
    title: 'Admin Login',
    description: 'Authorized access portal for ITNEXUS administrative controls.',
    ogType: 'private'
  });

  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [email, setEmail] = useState(''); // Serves as username / email input
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend auth service failed. Please check server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('An OTP verification code has been sent to your registered email.');
        setMode('reset');
      } else {
        setError(data.message || 'Could not initiate password reset.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reach backend service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully. Please log in with your new credentials.');
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setMode('login');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reach backend service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setError('');
    setSuccess('');
    setMode(newMode);
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">

        {/* Brand Icon */}
        <div className="text-center space-y-3">
          <div className="h-12 w-12 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center mx-auto border border-brand-blue/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-brand-navy">ITNEXUS Console</h1>
          <p className="text-xs text-brand-slate">
            {mode === 'login' && 'Authenticate to access content management tools.'}
            {mode === 'forgot' && 'Enter your username or registered email to request a reset.'}
            {mode === 'reset' && 'Enter the OTP code sent to your email and your new password.'}
          </p>
        </div>

        {error && (
          <div className="bg-amber-50 text-amber-800 text-xs p-4 rounded-xl border border-amber-200 flex items-start gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-800 text-xs p-4 rounded-xl border border-green-200 flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Console Username</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-slate/40" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">Console Password</label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs font-semibold text-brand-blue hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-slate/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Request Reset Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Console Username / Email</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-slate/40" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              {loading ? 'Sending OTP...' : 'Send OTP Code'}
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-slate hover:text-brand-navy transition-colors py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </form>
        )}

        {/* Reset Password Form */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">OTP Verification Code</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-slate/40" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-slate/40" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-slate/40" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-slate hover:text-brand-navy transition-colors py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Cancel and Back to Sign In
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

