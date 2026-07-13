import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FaqAccordion from '@/components/FaqAccordion/FaqAccordion';
import styles from '../info.module.css';

export default function FaqPage() {
  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Frequently Asked Questions</h1>
            <p className={styles.pageSubtitle}>Everything you need to know about delivery terms, used book trading, and hours</p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      <Footer />
    </div>
  );
}
