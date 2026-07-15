'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Lock, UserPlus, Mail, ShieldCheck } from 'lucide-react';
import styles from '../user.module.css';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // OTP States
  const [otpMode, setOtpMode] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleOtpAction = () => {
    if (!otpSent) {
      if (otpPhone.trim().length >= 10) {
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(randomOtp);
        setOtpSent(true);
        alert(`Verification OTP code sent to phone number: ${otpPhone}! Enter ${randomOtp} to verify. 💬`);
      } else {
        alert('Please enter a valid 10-digit mobile number.');
      }
    } else {
      if (otpCode === generatedOtp) {
        alert('OTP Verified successfully! Welcome back to Vidhya Books.');
        localStorage.setItem('vbs_user_token', `phone.${otpPhone}@vidhyabookstore.com`);
        window.location.href = '/account';
      } else {
        alert(`Invalid OTP. Please enter the correct verification code sent to your phone.`);
      }
    }
  };

  const handleGoogleLogin = () => {
    alert("Google Sign-In popup launched successfully! Sourced student Google Account. ✓");
    localStorage.setItem("vbs_user_token", "google.student@gmail.com");
    window.location.href = "/account";
  };

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logged in successfully as: ${loginEmail}! Welcome back to Vidhya Book Store. 📚`);
    localStorage.setItem('vbs_user_token', loginEmail);
    window.location.href = '/account';
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Account registered successfully for ${regName}! Check your email: ${regEmail} for verification. ✉️`);
    setActiveTab('login');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${forgotEmail}. Please check your spam folder if not received in 5 minutes.`);
    setForgotEmail('');
    setActiveTab('login');
  };

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.authCard}>
            {/* Tabs Header */}
            <div className={styles.authTabs}>
              <button
                onClick={() => setActiveTab('login')}
                className={activeTab === 'login' ? styles.activeAuthTab : styles.authTab}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={activeTab === 'register' ? styles.activeAuthTab : styles.authTab}
              >
                Register
              </button>
              <button
                onClick={() => setActiveTab('forgot')}
                className={activeTab === 'forgot' ? styles.activeAuthTab : styles.authTab}
              >
                Reset Pass
              </button>
            </div>

            {/* Login Tab Content */}
            {activeTab === 'login' && (
              <div className={styles.authBody}>
                <h2 className={styles.authTitle}>Sign In To Your Account</h2>
                <form onSubmit={handleLoginSubmit} className={styles.authForm}>
                  {/* OTP vs Password toggles */}
                  {!otpMode ? (
                    <>
                      <div className={styles.formGroup}>
                        <label htmlFor="l-email">Student Email *</label>
                        <input
                          type="email"
                          id="l-email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="student@gmail.com"
                          required
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="l-pass">Password *</label>
                        <input
                          type="password"
                          id="l-pass"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          placeholder="••••••••"
                          required
                          className={styles.input}
                        />
                      </div>
                      <button type="submit" className={styles.authSubmitBtn}>
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={styles.formGroup}>
                        <label htmlFor="l-phone">10-digit Phone Number *</label>
                        <input
                          type="tel"
                          id="l-phone"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          required
                          className={styles.input}
                        />
                      </div>
                      {otpSent ? (
                        <div className={styles.formGroup}>
                          <label htmlFor="l-code">Enter 6-Digit OTP *</label>
                          <input
                            type="text"
                            id="l-code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="e.g. 100000"
                            maxLength={6}
                            required
                            className={styles.input}
                          />
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleOtpAction}
                        className={styles.authSubmitBtn}
                      >
                        {otpSent ? 'Verify OTP & Login' : 'Send Verification OTP'}
                      </button>
                    </>
                  )}

                  <div style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setOtpMode(!otpMode)}
                      style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      {otpMode ? 'Use Password Login instead' : 'Login via SMS Mobile OTP'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
                  </div>

                  {/* Google Login button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#ffffff',
                      color: 'var(--color-text-main)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.2-.43-4.75H24v9h12.75C35.15 31.85 30.82 35 24 35c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48c12.75 0 23.44-4.22 31.25-11.51l-7.25-5.6C44.8 32.22 41.56 34 37.5 34c-6.82 0-11.15-3.15-12.75-5.75H46.5z"/>
                      <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.25-5.6c-2.4 1.63-5.5 2.61-8.64 2.61-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>
              </div>
            )}

            {/* Register Tab Content */}
            {activeTab === 'register' && (
              <div className={styles.authBody}>
                <h2 className={styles.authTitle}>Create Student Account</h2>
                <form onSubmit={handleRegisterSubmit} className={styles.authForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="r-name">Full Name *</label>
                    <input
                      type="text"
                      id="r-name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Aditya Sharma"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="r-email">Student Email *</label>
                    <input
                      type="email"
                      id="r-email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. aditya@gmail.com"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="r-phone">Mobile Number *</label>
                    <input
                      type="tel"
                      id="r-phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="10-digit phone"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="r-pass">Choose Password *</label>
                    <input
                      type="password"
                      id="r-pass"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.authSubmitBtn}>
                    Register Account
                  </button>
                </form>
              </div>
            )}

            {/* Forgot Password Tab Content */}
            {activeTab === 'forgot' && (
              <div className={styles.authBody}>
                <h2 className={styles.authTitle}>Forgot Password?</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                  Enter your registered email below, and we will send you a secure link to reset your account password.
                </p>
                <form onSubmit={handleForgotSubmit} className={styles.authForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="f-email">Registered Email *</label>
                    <input
                      type="email"
                      id="f-email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      required
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.authSubmitBtn}>
                    Reset Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
