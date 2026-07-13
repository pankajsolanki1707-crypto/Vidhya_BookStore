import React from 'react';
import Link from 'next/link';
import {
  BookOpen, Phone, MessageSquare, MapPin, Clock,
  ShieldCheck, Truck, RotateCcw, BadgePercent, Star,
  Globe, Send, ChevronRight, FileText, HelpCircle
} from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { label: 'Competitive Exams', href: '/books?category=Competitive%20Exams' },
    { label: 'Academic Textbooks', href: '/books?category=Academic%20Textbooks' },
    { label: 'Novels & Literature', href: '/books?category=Novels%20%26%20Literature' },
    { label: 'Stationery & Supplies', href: '/books?category=Stationery' },
    { label: 'Used Books', href: '/books?category=Used%20Books' },
    { label: 'All Books', href: '/books' },
  ];

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Store Gallery', href: '/gallery' },
    { label: 'Bulk Orders', href: '/bulk' },
    { label: 'Sell Used Books', href: '/used-books' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const policies = [
    { label: 'Privacy Policy', href: '/policies' },
    { label: 'Shipping Policy', href: '/policies' },
    { label: 'Return Policy', href: '/policies' },
  ];

  const trustItems = [
    { icon: <ShieldCheck size={22} />, title: '100% Original Books', desc: 'Official academy publications' },
    { icon: <Truck size={22} />, title: 'Same-Day Delivery', desc: 'Fast delivery across Indore' },
    { icon: <BadgePercent size={22} />, title: 'Student Discounts', desc: 'Best prices guaranteed' },
    { icon: <RotateCcw size={22} />, title: 'Easy Exchange', desc: 'Hassle-free return policy' },
  ];

  return (
    <footer className={styles.footer}>
      {/* Trust Banner */}
      <div className={styles.trustBanner}>
        <div className="container">
          <div className={styles.trustBannerGrid}>
            {trustItems.map((item, i) => (
              <div key={i} className={styles.trustBannerItem}>
                <div className={styles.trustBannerIconWrap}>{item.icon}</div>
                <div className={styles.trustBannerBody}>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Column 1: Brand */}
            <div className={styles.footerCol}>
              <div className={styles.logo}>
                <BookOpen size={26} className={styles.logoIcon} />
                <div>
                  <div className={styles.logoText}>VIDHYA BOOK STORE</div>
                  <div className={styles.logoSubtext}>& Stationery, Indore</div>
                </div>
              </div>
              <p className={styles.storeIntro}>
                Indore's trusted destination for competitive exam books, academic study materials,
                university textbooks, novels, and premium stationery — serving students for 20+ years.
              </p>
              <div className={styles.workingHours}>
                <Clock size={14} />
                <span>Open Daily: 9:30 AM – 9:30 PM</span>
              </div>
              <div className={styles.socialRow}>
                <a href="https://wa.me/919752809717" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="WhatsApp">
                  <MessageSquare size={16} />
                </a>
                <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Telegram">
                  <Send size={16} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram">
                  <Globe size={16} />
                </a>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div className={styles.footerCol}>
              <h3 className={styles.colTitle}>Categories</h3>
              <ul className={styles.linkList}>
                {categories.map((c, i) => (
                  <li key={i}>
                    <Link href={c.href} className={styles.footerLink}>
                      <ChevronRight size={12} />
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className={styles.footerCol}>
              <h3 className={styles.colTitle}>Quick Links</h3>
              <ul className={styles.linkList}>
                {quickLinks.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className={styles.footerLink}>
                      <ChevronRight size={12} />
                      {l.label}
                    </Link>
                  </li>
                ))}
                {policies.map((p, i) => (
                  <li key={`p-${i}`}>
                    <Link href={p.href} className={styles.footerLink}>
                      <ChevronRight size={12} />
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className={styles.footerCol}>
              <h3 className={styles.colTitle}>Visit Our Store</h3>
              <div className={styles.contactInfo}>
                <div className={styles.contactRow}>
                  <MapPin size={16} className={styles.contactIcon} />
                  <span>
                    B-6, Payal Plaza, Bhanwarkuan,<br />
                    <strong style={{ color: '#FCD116' }}>(Below Kautilya Academy)</strong><br />
                    Indore, Madhya Pradesh – 452001
                  </span>
                </div>
                <div className={styles.contactRow}>
                  <Phone size={15} className={styles.contactIcon} />
                  <span>
                    Call / WhatsApp:{' '}
                    <a href="tel:9752809717" className={styles.callLink}>9752809717</a>
                  </span>
                </div>
                <div className={styles.contactRow}>
                  <Send size={15} className={styles.contactIcon} />
                  <span>
                    Telegram:{' '}
                    <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer" className={styles.callLink}>8982883332</a>
                  </span>
                </div>
                <div className={styles.contactRow}>
                  <Star size={15} className={styles.contactIcon} />
                  <span style={{ color: '#FCD116', fontWeight: 600 }}>4.9★ on Google Reviews</span>
                </div>
              </div>
              <div className={styles.contactActions}>
                <a href="https://wa.me/919752809717" target="_blank" rel="noopener noreferrer" className={`${styles.contactBtn} ${styles.contactBtnWhatsapp}`}>
                  <MessageSquare size={13} />
                  WhatsApp
                </a>
                <a href="tel:9752809717" className={`${styles.contactBtn} ${styles.contactBtnCall}`}>
                  <Phone size={13} />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Row */}
      <div className={styles.footerMid}>
        <div className="container">
          <div className={styles.footerMidRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className={styles.paymentLabel}>Accepted Payments:</span>
              <div className={styles.paymentIcons}>
                {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Debit Card', 'Credit Card', 'COD'].map((p) => (
                  <span key={p} className={styles.paymentBadge}>{p}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.78rem' }}>
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
              <span>Secure & Verified Transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomContent}>
            <p>© {currentYear} Vidhya Book Store &amp; Stationery. All Rights Reserved.</p>
            <p className={styles.indoreBadge}>Made with ❤️ for Indore Aspirants</p>
            <div className={styles.bottomLinks}>
              <Link href="/policies" className={styles.bottomLink}>Privacy</Link>
              <Link href="/policies" className={styles.bottomLink}>Terms</Link>
              <Link href="/admin" className={styles.bottomLink}>Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
