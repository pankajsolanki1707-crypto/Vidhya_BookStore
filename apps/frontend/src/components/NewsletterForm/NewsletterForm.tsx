'use client';

import React, { useState } from 'react';
import styles from '@/app/home.module.css';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing! A confirmation link has been sent to: ${email} 💡`);
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
      <input
        type="email"
        placeholder="Enter your student email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.newsletterInput}
      />
      <button type="submit" className={styles.newsletterSubmit}>
        Join Club
      </button>
    </form>
  );
}
