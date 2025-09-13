"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Shield, Key, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '@/utils/api';

type Step = 'email' | 'otp' | 'password';

const ResetPasswordPage = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpExpiry) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, otpExpiry - Date.now());
        setTimeLeft(Math.floor(remaining / 1000));
        if (remaining <= 0) {
          setOtpExpiry(null);
          setTimeLeft(0);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpExpiry]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await api.post(`/api/v1/auth/send-password-recovery/${encodeURIComponent(email)}`);
      setMessage('OTP sent to your email successfully!');
      setStep('otp');
      setOtpExpiry(Date.now() + (10 * 60 * 1000)); // 10 minutes
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String((err as { message?: unknown }).message));
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await api.post('/api/v1/auth/validate-password-recovery-otp', { otp });
      setMessage('OTP verified successfully!');
      setStep('password');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String((err as { message?: unknown }).message));
      } else {
        setError('Invalid OTP or OTP has expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await api.post('/api/v1/auth/handle-password-recovery', {
        otp,
        newPassword: password
      });
      setMessage('Password reset successfully! You can now sign in with your new password.');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String((err as { message?: unknown }).message));
      } else {
        setError('Failed to reset password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setMessage(null);
    setError(null);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        step === 'email' ? 'bg-blue-600 text-white' :
        step === 'otp' || step === 'password' ? 'bg-green-600 text-white' :
        'bg-gray-200 text-gray-600'
      }`}>
        <Mail className="w-4 h-4" />
      </div>
      <div className={`flex-1 h-1 ${
        step === 'otp' || step === 'password' ? 'bg-green-600' : 'bg-gray-200'
      }`} />
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        step === 'otp' ? 'bg-blue-600 text-white' :
        step === 'password' ? 'bg-green-600 text-white' :
        'bg-gray-200 text-gray-600'
      }`}>
        <Shield className="w-4 h-4" />
      </div>
      <div className={`flex-1 h-1 ${
        step === 'password' ? 'bg-green-600' : 'bg-gray-200'
      }`} />
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        step === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        <Key className="w-4 h-4" />
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <form onSubmit={handleSendOTP} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
            </div>
          )}
          {message && (
        <div className="p-3 text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{message}</span>
            </div>
          )}

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          Email address
        </label>
          <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
            />
          </div>
      </div>

      {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Sending OTP...</span>
          </>
        ) : (
          <>
            <span>Send OTP</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      {timeLeft > 0 && (
        <div className="p-3 text-sm text-blue-800 bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>OTP expires in: {formatTime(timeLeft)}</span>
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="p-3 text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* OTP Field */}
      <div className="space-y-2">
        <label
          htmlFor="otp"
          className="text-sm font-medium text-foreground"
        >
          Verification Code
        </label>
        <div className="text-center">
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="text"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            placeholder="000000"
            className="w-full py-3 px-4 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
          />
          <p className="text-sm text-muted-foreground mt-2">Enter the 6-character code sent to {email}</p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify OTP</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Try Again Button */}
      <button
        type="button"
        onClick={handleBackToEmail}
        className="w-full text-sm font-medium text-primary hover:underline"
      >
        Didn&apos;t receive OTP? Try again
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="p-3 text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* New Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
        />
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-foreground"
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !password || !confirmPassword}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Resetting Password...</span>
          </>
        ) : (
          <>
            <span>Reset Password</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FBFBFB] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground">
            Secure your account with a new password.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 border border-gray-200/80 rounded-2xl shadow-sm">
          {step !== 'email' && (
            <button
              onClick={step === 'otp' ? handleBackToEmail : () => setStep('otp')}
              className="flex items-center text-primary hover:text-primary/80 transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          )}

          {renderStepIndicator()}

          {step === 'email' && renderEmailStep()}
          {step === 'otp' && renderOtpStep()}
          {step === 'password' && renderPasswordStep()}
          </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
