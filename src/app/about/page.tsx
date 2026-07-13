import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Award, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import styles from '../info.module.css';

export default function AboutPage() {
  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>About Vidhya Book Store</h1>
            <p className={styles.pageSubtitle}>Indore's trusted academic and competitive exam study hub since years</p>
          </div>

          {/* About core grid */}
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <h2 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Serving Indore's Aspirants</h2>
              <p>
                Vidhya Book Store & Stationery is located in Bhanwarkuan, the heart of Central India's coaching hub. Situated right below the famous Kautilya Academy in Payal Plaza, we have grown into a cornerstone for students preparing for civil services and competitive examinations.
              </p>
              <p>
                Our vision is to provide 100% authentic, high-quality prints and books at affordable prices. We stock the complete preparation sets for MPPSC (Mains & Prelims), UPSC Civil Services, PEB Vyapam, Banking, SSC, and Railway exams.
              </p>
              <p>
                Beyond competitive examinations, we are Indore's leading supplier of university textbooks (Engineering, MBA, BBA, B.Pharm) for DAVV students, standard school CBSE board books, and premium stationary items.
              </p>
            </div>
            <div>
              <img
                src="/images/shop_interior.jpg"
                alt="Vidhya Books Shop Interior Counter"
                className={styles.aboutImage}
              />
            </div>
          </div>

          {/* Statistics Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>10,000+</span>
              <span className={styles.statLabel}>Exam Guides & Books</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>50,000+</span>
              <span className={styles.statLabel}>Happy Students Served</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>100%</span>
              <span className={styles.statLabel}>Official Sourced Notes</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>Same-Day</span>
              <span className={styles.statLabel}>Local Indore Delivery</span>
            </div>
          </div>

          {/* Secondary details block */}
          <div className={styles.aboutGrid} style={{ marginTop: '60px', gridTemplateColumns: '0.9fr 1.1fr' }}>
            <div>
              <img
                src="/images/bookshelves.jpg"
                alt="Vidhya Books Stacks of exam materials"
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.aboutText}>
              <h2 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Sustainable Trading: Buy & Sell Used Books</h2>
              <p>
                At Vidhya Books, we promote environmental and financial sustainability in education. We offer a dedicated trade-in service:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  <span><strong>Sell Used Books:</strong> Bring your old semester books or exam guides and get cash instantly.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  <span><strong>Buy Secondhand:</strong> Purchase pre-owned verified copies of standard guides at up to 60% off!</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  <span><strong>Premium Stationery:</strong> Grab Casio scientific calculators, Luxor Parker pens, and school kits.</span>
                </li>
              </ul>
              <p>
                Our retail store coordinates: B-6, Payal Plaza, Bhanwarkuan (Kautilya Academy ke niche) Indore. Feel free to call us at <strong>9752809717</strong> or send a message on Telegram at <strong>8982883332</strong>.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
