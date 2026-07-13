'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight, ShieldCheck, ThumbsUp, Sparkles, Star, Truck
} from 'lucide-react';
import styles from './Hero.module.css';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }
};

export default function Hero() {
  const scrollingCategories = [
    { name: 'UPSC Prep Guides', icon: '🏛️' },
    { name: 'MPPSC Mains Modules', icon: '🦁' },
    { name: 'Engineering DAVV Textbooks', icon: '⚙️' },
    { name: 'Used Reference Books', icon: '🔄' },
    { name: 'Classmate Registers', icon: '📓' },
    { name: 'Casio Calculators', icon: '🧮' },
    { name: 'Best Novels', icon: '📚' },
    { name: 'BBA & MBA Notes', icon: '📊' },
    { name: 'School CBSE Sets', icon: '🎒' },
    { name: 'Kautilya Publications', icon: '🎯' },
  ];

  const floatingCards = [
    { emoji: '📚', strong: '50,000+ Books', span: 'In physical stock', style: { top: '8%', left: '-6%' }, delay: 0 },
    { emoji: '🏆', strong: '20+ Years', span: 'Student trust', style: { bottom: '22%', right: '-8%' }, delay: 1 },
    { emoji: '⚡', strong: 'Same-Day', span: 'Indore delivery', style: { bottom: '4%', left: '14%' }, delay: 0.5 },
    { emoji: '⭐', strong: '4.9★ Rating', span: 'Google Reviews', style: { top: '38%', right: '-12%' }, delay: 1.5 },
  ];

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroGrid}>
          {/* ── Left Column ── */}
          <motion.div
            className={styles.textContainer}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className={styles.tagline} variants={itemVariants}>
              <Sparkles size={13} className={styles.tagIcon} />
              <span>Indore's Premier Student Bookstore Hub</span>
            </motion.div>

            <motion.h1 className={styles.title} variants={itemVariants}>
              Fueling Your Dreams With the{' '}
              <span className={styles.highlight}>Right Books</span>
            </motion.h1>

            <motion.p className={styles.description} variants={itemVariants}>
              Located right below Kautilya Academy in Bhanwarkuan — Indore's coaching hub.
              New & pre-owned UPSC/MPPSC materials, DAVV textbooks, novels, and premium
              stationery at student-friendly prices.
            </motion.p>

            {/* Store Statistics */}
            <motion.div className={styles.statsRow} variants={itemVariants}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>50k+</span>
                <span className={styles.statLabel}>Books in Stock</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNumber}>20+</span>
                <span className={styles.statLabel}>Years Serving</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNumber}>4.9★</span>
                <span className={styles.statLabel}>Google Rating</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Original Books</span>
              </div>
            </motion.div>

            {/* Delivery Badge */}
            <motion.div className={styles.deliveryBadge} variants={itemVariants}>
              <span className={styles.deliveryPulse} />
              <span>⚡ Same-Day Delivery to Indore Hostels &amp; Library desks!</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className={styles.actions} variants={itemVariants}>
              <Link href="/books" className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.btnText}>Explore Shop</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/books?category=Competitive%20Exams" className="btn-secondary">
                Competitive Prep
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div className={styles.trustRow} variants={itemVariants}>
              <div className={styles.trustItem}>
                <ShieldCheck size={15} className={styles.trustIcon} />
                <span>100% Original Publications</span>
              </div>
              <div className={styles.trustItem}>
                <ThumbsUp size={15} className={styles.trustIcon} />
                <span>Trusted by 50k+ Students</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={15} className={styles.trustIcon} />
                <span>Fast Local Delivery</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Premium Collage ── */}
          <motion.div
            className={styles.visualContainer}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.collageFrame}>
              {/* Main image */}
              <div className={styles.imageMain}>
                <img
                  src="/images/storefront_entry.jpg"
                  alt="Vidhya Book Store Front Entrance, Indore"
                  className={styles.collageImg}
                />
              </div>
              {/* Secondary image */}
              <div className={styles.imageSecondary}>
                <img
                  src="/images/bookshelves.jpg"
                  alt="Vidhya Book Store Bookshelves"
                  className={styles.collageImg}
                />
              </div>
              {/* Tertiary image */}
              <div className={styles.imageTertiary}>
                <img
                  src="/images/shop_interior.jpg"
                  alt="Vidhya Book Store Shop Interior"
                  className={styles.collageImg}
                />
              </div>

              {/* Floating Glass Cards */}
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  className={styles.floatingCard}
                  style={card.style}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                >
                  <span className={styles.cardEmoji}>{card.emoji}</span>
                  <div className={styles.cardInfo}>
                    <strong>{card.strong}</strong>
                    <span>{card.span}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Scrolling Categories Banner */}
      <div className={styles.scrollingBanner}>
        <div className={styles.scrollingTrack}>
          {scrollingCategories.concat(scrollingCategories).map((cat, idx) => (
            <div key={idx} className={styles.scrollingItem}>
              <span className={styles.scrollingEmoji}>{cat.icon}</span>
              <span>{cat.name}</span>
              {idx < scrollingCategories.length * 2 - 1 && (
                <span className={styles.scrollingDot} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
