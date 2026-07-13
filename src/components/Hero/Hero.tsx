'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, PenTool, Award, ChevronRight } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Left Column: Text & CTAs */}
          <div className={styles.textContainer}>
            <div className={styles.tagline}>
              <Award size={16} className={styles.tagIcon} />
              <span>Indore's Most Trusted Bookstore & Stationery</span>
            </div>
            
            <h1 className={styles.title}>
              Fueling Your Dreams With the <span className={styles.highlight}>Right Books</span>
            </h1>
            
            <p className={styles.description}>
              Located right below Kautilya Academy in Bhanwarkuan (Indore's coaching hub). We offer new and used UPSC/MPPSC preparation books, coaching notes, BBA/MBA/B.Pharm college textbooks, novels, and premium stationery.
            </p>
            
            <div className={styles.actions}>
              <Link href="/books" className="btn-accent">
                <span className={styles.btnText}>Explore Catalog</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/books?category=Competitive%20Exams" className="btn-secondary">
                Competitive Exam Prep
              </Link>
            </div>

            {/* Quick stats banner */}
            <div className={styles.statsBanner}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>New & Old</span>
                <span className={styles.statLabel}>Books Traded</span>
              </div>
              <div className={styles.statLine}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Coaching Notes</span>
              </div>
              <div className={styles.statLine}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>Indore</span>
                <span className={styles.statLabel}>Local Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Storefront Entry image */}
          <div className={styles.visualContainer}>
            <div className={styles.storefrontFrame}>
              <img
                src="/images/storefront_entry.jpg"
                alt="Vidhya Book Store & Stationery Storefront at Bhanwarkuan, Indore"
                className={styles.storefrontImg}
              />
              <div className={styles.storefrontBadge}>
                <span className={styles.badgeLabel}>OUR PHYSICAL SHOP</span>
                <span className={styles.badgeAddress}>B-6, Payal Plaza (Below Kautilya Academy)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
