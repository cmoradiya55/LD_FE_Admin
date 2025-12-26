'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Phone, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import PublicRoute from '@/components/Route/PublicRoute';
import { LoadingSpinner } from '@/components/common';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const { sendOTP, login } = useAuth();
  const [step, setStep] = useState<'method' | 'otp'>('method');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus inputs
  useEffect(() => {
    if (step === 'method' && contactInputRef.current) {
      contactInputRef.current.focus();
    } else if (step === 'otp' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Validate phone number (10 digits)
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  // Format phone number display
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const cleanedContact = contact.replace(/\D/g, '');
    if (!validatePhone(cleanedContact)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }
    
    const result = await sendOTP(cleanedContact);
    
    if (result.success) {
      setStep('otp');
      setSuccess('OTP sent successfully!');
      setResendCooldown(60); // 60 second cooldown
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to send OTP');
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      setLoading(false);
      return;
    }
    
    const cleanedContact = contact.replace(/\D/g, '');
    const result = await login(cleanedContact, otp);
    
    if (!result.success) {
      setError(result.error || 'Invalid OTP');
    }
    // If successful, login function will handle redirect to dashboard
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setSuccess('');
    setOtp('');
    setLoading(true);
    
    const cleanedContact = contact.replace(/\D/g, '');
    const result = await sendOTP(cleanedContact);
    
    if (result.success) {
      setSuccess('OTP resent successfully!');
      setResendCooldown(60);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
    
    setLoading(false);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setContact(formatted);
    setError('');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-md w-full">
          {/* Logo & Header */}
          <div className="text-center mb-8 animate-in">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <Image 
                  src="/logo.webp" 
                  alt="AutoMarket logo" 
                  width={90} 
                  height={90} 
                  priority 
                  className="drop-shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to AutoMarket
            </h1>
            <p className="text-gray-600 text-sm">
              Your trusted platform to buy & sell cars
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-in slide-in-from-bottom-4">
            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2 animate-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2 animate-in">
                <span className="text-red-500">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {step === 'method' ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Login
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Enter your phone number to receive an OTP
                  </p>
                </div>

                <form onSubmit={handleSendOTP}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        +91
                      </div>
                      <input
                        ref={contactInputRef}
                        type="tel"
                        placeholder="9090909090"
                        className="input-field pl-14"
                        value={contact}
                        onChange={handleContactChange}
                        required
                        disabled={loading}
                        maxLength={10}
                        inputMode="numeric"
                      />
                    </div>
                    {contact && !validatePhone(contact) && (
                      <p className="mt-1 text-xs text-red-600">
                        Please enter a valid 10-digit phone number
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !validatePhone(contact)}
                    variant="primary"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" color="white" />
                        Sending...
                      </span>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setStep('method');
                    setError('');
                    setSuccess('');
                    setOtp('');
                    setResendCooldown(0);
                  }}
                  className="flex items-center text-primary-600 mb-6 hover:text-primary-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                  type="button"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Verify OTP
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    We&apos;ve sent a 6-digit code to{' '}
                    <span className="font-semibold text-gray-900">+91 {contact}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      ref={otpInputRef}
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      className="input-field text-center text-xl tracking-[0.5em] font-normal"
                      value={otp}
                      onChange={handleOtpChange}
                      required
                      disabled={loading}
                      inputMode="numeric"
                    />
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      {otp.length}/6 digits
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || otp.length !== 6}
                    variant="primary"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" color="white" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={handleResendOTP}
                    className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={loading || resendCooldown > 0}
                    type="button"
                  >
                    {resendCooldown > 0 ? (
                      <span className="text-gray-500">
                        Resend OTP in {resendCooldown}s
                      </span>
                    ) : (
                      'Resend OTP'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </PublicRoute>
  );
}
