import React from 'react';
import Link from 'next/link';
import { BookOpen, Phone, MessageSquare, MapPin, Clock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Trust Badges */}
      <div className={styles.trustBanner}>
        <div className="container">
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <Truck className={styles.trustIcon} size={32} />
              <div>
                <h4 className={styles.trustTitle}>Local Delivery</h4>
                <p className={styles.trustText}>Fast delivery across Indore</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <ShieldCheck className={styles.trustIcon} size={32} />
              <div>
                <h4 className={styles.trustTitle}>100% Genuine</h4>
                <p className={styles.trustText}>Official academy publications</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <RotateCcw className={styles.trustIcon} size={32} />
              <div>
                <h4 className={styles.trustTitle}>Easy Exchange</h4>
                <p className={styles.trustText}>Hassle-free return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Column 1: Store Intro */}
            <div className={styles.footerCol}>
              <div className={styles.logo}>
                <BookOpen size={24} className={styles.logoIcon} />
                <span className={styles.logoText}>VIDHYA BOOK STORE</span>
              </div>
              <p className={styles.storeIntro}>
                Vidhya Book Store & Stationery is Indore's trusted destination for competitive examination books, academic study materials, standard textbooks, novels, and premium office stationery.
              </p>
              <div className={styles.workingHours}>
                <Clock size={16} />
                <span>Open Daily: 9:30 AM - 9:30 PM</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className={styles.footerCol}>
              <h3 className={styles.colTitle}>Browse categories</h3>
              <ul className={styles.linkList}>
                <li><Link href="/books?category=Competitive%20Exams" className={styles.footerLink}>Competitive Exams</Link></li>
                <li><Link href="/books?category=Academic%20Textbooks" className={styles.footerLink}>Academic Textbooks</Link></li>
                <li><Link href="/books?category=Novels%20%26%20Literature" className={styles.footerLink}>Novels & Literature</Link></li>
                <li><Link href="/books?category=Stationery" className={styles.footerLink}>Stationery & Supplies</Link></li>
                <li><Link href="/admin" className={styles.footerLink}>Admin Console</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact & Address */}
            <div className={styles.footerCol}>
              <h3 className={styles.colTitle}>Visit Store</h3>
              <div className={styles.contactInfo}>
                <div className={styles.contactRow}>
                  <MapPin className={styles.contactIcon} size={32} />
                  <span>
                    B-6, Payal Plaza, Bhanwarkuan,<br />
                    <strong>(Kautilya Academy ke niche)</strong><br />
                    Indore, Madhya Pradesh
                  </span>
                </div>
                <div className={styles.contactRow}>
                  <Phone className={styles.contactIcon} size={18} />
                  <span>
                    Phone: <a href="tel:9752809717" className={styles.callLink}>9752809717</a>
                  </span>
                </div>
                <div className={styles.contactRow}>
                  <MessageSquare className={styles.contactIcon} size={18} />
                  <span>
                    Telegram: <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer" className={styles.callLink}>8982883332</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomContent}>
            <p>© {new Date().getFullYear()} Vidhya Book Store & Stationery. All Rights Reserved.</p>
            <p className={styles.indoreBadge}>Made for Indore Aspirants ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
