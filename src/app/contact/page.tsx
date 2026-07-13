'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { MapPin, Phone, MessageSquare, Clock, Send } from 'lucide-react';
import styles from '../info.module.css';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Competitive Exam Materials');
  const [message, setMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${name}! Your query regarding "${subject}" has been submitted to the Vidhya Books team. We will get back to you within 24 hours. 📞`);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Contact Us</h1>
            <p className={styles.pageSubtitle}>Reach out for custom textbook orders, used book queries, or local delivery status</p>
          </div>

          <div className={styles.contactGrid}>
            {/* Left Col: Form */}
            <div className={styles.contactFormCard}>
              <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '20px' }}>Send Us a Message</h2>
              <form onSubmit={handleContactSubmit} className={styles.loginForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="c-name">Full Name *</label>
                    <input
                      type="text"
                      id="c-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aditya Sharma"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="c-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="c-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      required
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="c-email">Email Address</label>
                    <input
                      type="email"
                      id="c-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aditya@gmail.com"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="c-subj">I am looking for...</label>
                    <select
                      id="c-subj"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={styles.select}
                    >
                      <option value="Competitive Exam Materials">Competitive Prep (MPPSC/UPSC)</option>
                      <option value="DAVV College Textbooks">DAVV Textbooks (Engineering/BBA/MBA)</option>
                      <option value="Used Books Trading">Buy/Sell Used Books</option>
                      <option value="Premium Stationery Items">Stationery Supplies</option>
                      <option value="Bulk/Coaching Orders">Bulk/Coaching Orders</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroupFull} style={{ marginTop: '16px' }}>
                  <label htmlFor="c-msg">Message / Book List *</label>
                  <textarea
                    id="c-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe books or stationery items you want to order..."
                    required
                    className={styles.textarea}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Query
                </button>
              </form>
            </div>

            {/* Right Col: Info */}
            <div className={styles.contactInfoCard}>
              <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>Store Details</h2>

              <div className={styles.contactRow}>
                <MapPin className={styles.contactIcon} size={28} />
                <div className={styles.contactText}>
                  <h4>Physical Outlet Address</h4>
                  <p>
                    B-6, Payal Plaza, Bhanwarkuan,<br />
                    <strong>(Kautilya Academy ke niche)</strong><br />
                    Indore, Madhya Pradesh - 452001
                  </p>
                </div>
              </div>

              <div className={styles.contactRow}>
                <Phone className={styles.contactIcon} size={20} />
                <div className={styles.contactText}>
                  <h4>Call Store Manager</h4>
                  <p>
                    Phone: <a href="tel:9752809717" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>9752809717</a>
                  </p>
                </div>
              </div>

              <div className={styles.contactRow}>
                <Send className={styles.contactIcon} size={20} />
                <div className={styles.contactText}>
                  <h4>Telegram Support</h4>
                  <p>
                    Username: <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>8982883332</a>
                  </p>
                </div>
              </div>

              <div className={styles.contactRow}>
                <Clock className={styles.contactIcon} size={20} />
                <div className={styles.contactText}>
                  <h4>Working Hours</h4>
                  <p>
                    Monday to Sunday<br />
                    9:30 AM - 9:30 PM (Daily)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
