'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronRight, ShieldCheck, ThumbsUp, Sparkles
} from 'lucide-react';
import styles from './Hero.module.css';

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
    { name: 'School CBSE Sets', icon: '🎒' }
  ];

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Left Column: Text & CTAs */}
          <div className={styles.textContainer}>
            <div className={styles.tagline}>
              <Sparkles size={14} className={styles.tagIcon} />
              <span>Indore's Premier Student Bookstore Hub</span>
            </div>
            
            <h1 className={styles.title}>
              Fueling Your Dreams With the <span className={styles.highlight}>Right Books</span>
            </h1>
            
            <p className={styles.description}>
              Located right below Kautilya Academy in Bhanwarkuan (Indore's coaching hub). We offer new and pre-owned UPSC/MPPSC preparation materials, DAVV university textbooks, novels, and premium stationery at student-friendly prices.
            </p>

            {/* Delivery & Student Hooks */}
            <div className={styles.deliveryBadge}>
              <span className={styles.deliveryPulse}></span>
              <span>⚡ Same-Day Delivery to Indore Hostels & Library desks!</span>
            </div>
            
            <div className={styles.actions}>
              <Link href="/books" className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.btnText}>Explore Shop</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/books?category=Competitive%20Exams" className="btn-secondary">
                Competitive Prep
              </Link>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <ShieldCheck size={16} className={styles.trustIcon} />
                <span>100% Original Publications</span>
              </div>
              <div className={styles.trustItem}>
                <ThumbsUp size={16} className={styles.trustIcon} />
                <span>Trusted by 50k+ Students</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Collage with Floating Cards */}
          <div className={styles.visualContainer}>
            <div className={styles.collageFrame}>
              {/* Storefront Image */}
              <div className={styles.imageMain}>
                <img
                  src="/images/storefront_entry.jpg"
                  alt="Vidhya Book Store Front Entrance, Indore"
                  className={styles.collageImg}
                />
              </div>

              {/* Bookshelves Image Overlapping */}
              <div className={styles.imageSecondary}>
                <img
                  src="/images/bookshelves.jpg"
                  alt="Vidhya Book Store Bookshelves"
                  className={styles.collageImg}
                />
              </div>

              {/* Shop Interior Image Overlapping */}
              <div className={styles.imageTertiary}>
                <img
                  src="/images/shop_interior.jpg"
                  alt="Vidhya Book Store Shop Interior"
                  className={styles.collageImg}
                />
              </div>

              {/* Floating Cards (Framer Motion Animated) */}
              <motion.div 
                className={styles.floatingCard}
                style={{ top: '10%', left: '-5%' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className={styles.cardEmoji}>📚</span>
                <div className={styles.cardInfo}>
                  <strong>50,000+ Books</strong>
                  <span>In physical stock</span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.floatingCard}
                style={{ bottom: '20%', right: '-5%' }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <span className={styles.cardEmoji}>🏆</span>
                <div className={styles.cardInfo}>
                  <strong>20+ Years</strong>
                  <span>Student Trust</span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.floatingCard}
                style={{ bottom: '5%', left: '15%' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <span className={styles.cardEmoji}>⚡</span>
                <div className={styles.cardInfo}>
                  <strong>Same-Day</strong>
                  <span>Indore Delivery</span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.floatingCard}
                style={{ top: '40%', right: '-10%' }}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <span className={styles.cardEmoji}>🛡️</span>
                <div className={styles.cardInfo}>
                  <strong>Original Prints</strong>
                  <span>Zero piracy</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Scrolling Categories */}
      <div className={styles.scrollingBanner}>
        <div className={styles.scrollingTrack}>
          {scrollingCategories.concat(scrollingCategories).map((cat, idx) => (
            <div key={idx} className={styles.scrollingItem}>
              <span className={styles.scrollingEmoji}>{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
