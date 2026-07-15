import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import BookCard from '@/components/BookCard/BookCard';
import Footer from '@/components/Footer/Footer';
import MegaSearchConsole from '@/components/MegaSearchConsole/MegaSearchConsole';
import CountdownTimer from '@/components/CountdownTimer/CountdownTimer';
import FaqAccordion from '@/components/FaqAccordion/FaqAccordion';
import NewsletterForm from '@/components/NewsletterForm/NewsletterForm';
import { getProducts } from '@/lib/database';
import ConversionBoosters from '@/components/ConversionBoosters';
import StudentHub from '@/components/StudentHub';
import TestimonialCarousel from '@/components/TestimonialCarousel';

export const dynamic = 'force-dynamic';

import {
  ArrowRight, GraduationCap, PenTool, BookOpen, Star,
  MapPin, Phone, Send, ShieldCheck, BadgePercent,
  BookMarked, CheckCircle, Mail, Compass, Truck, RotateCcw,
  Library, Clock, MessageSquare, FileText, ShoppingBag
} from 'lucide-react';

import styles from './home.module.css';


export default function Home() {
  const products = getProducts().filter(p => !p.deletedAt && p.visibility !== 'Hidden' && p.visibility !== 'Draft');

  const featuredBooks    = products.filter(p => p.featured).slice(0, 4); // Editor's Picks
  const dealsBooks       = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4); // Flash Deals
  const newArrivals      = products.filter(p => p.isNewArrival).slice(0, 4); // Recently Added
  const competitiveBooks = products.filter(p => p.category === 'Competitive Exams').slice(0, 4); // Popular Competitive Books
  const academicBooks    = products.filter(p => p.category === 'Academic Textbooks' && p.subcategory !== 'School').slice(0, 4); // Popular College Books
  const schoolBooks      = products.filter(p => p.category === 'Academic Textbooks' && p.subcategory === 'School').slice(0, 4); // Popular School Books
  const usedBooks        = products.filter(p => p.category === 'Used Books').slice(0, 4);
  const stationeryItems  = products.filter(p => p.category === 'Stationery').slice(0, 4);
  const trendingBooks    = products.filter(p => p.rating >= 4.7).slice(0, 4); // Today's Trending
  const staffRecommend   = products.filter(p => p.isBestseller && p.featured).slice(0, 4); // Staff Recommendations

  const popularAuthors = [
    { name: 'M. Laxmikanth',   initial: 'ML', desc: 'Indian Polity Author' },
    { name: 'Dr. H.C. Verma',  initial: 'HV', desc: 'Conceptual Physics' },
    { name: 'James Clear',     initial: 'JC', desc: 'Atomic Habits Author' },
    { name: 'Amish Tripathi',  initial: 'AT', desc: 'Shiva Trilogy Fiction' },
    { name: 'Philip Kotler',   initial: 'PK', desc: 'Marketing Management' },
  ];

  const publishers = [
    'McGraw Hill',
    'S. Chand Publishing',
    'Kautilya Academy Publications',
    'Mahaveer Publication',
    'Pearson Education',
  ];

  const trustItems = [
    { icon: <ShieldCheck size={22} />, title: '100% Original Books',   desc: 'Zero piracy. Official publisher stock only.' },
    { icon: <FileText size={22} />,    title: 'GST Invoice Provided',  desc: 'Proper bills for all purchases.' },
    { icon: <Truck size={22} />,       title: 'Same-Day Delivery',     desc: 'Delivering across Indore in hours.' },
    { icon: <ShoppingBag size={22} />, title: 'Store Pickup Available',desc: 'Walk-in or click and collect.' },
    { icon: <BadgePercent size={22} />,title: 'Student Discounts',     desc: 'Best competitive prices guaranteed.' },
    { icon: <RotateCcw size={22} />,   title: 'Easy Exchange',         desc: 'Hassle-free return & swap policy.' },
    { icon: <Star size={22} />,        title: '4.9★ Google Rated',    desc: 'Loved by 50,000+ Indore students.' },
    { icon: <BookOpen size={22} />,    title: '20+ Years Experience',  desc: 'Two decades of serving aspirants.' },
  ];

  const testimonials = [
    {
      name: 'Aditya Sharma',
      meta: 'MPPSC Aspirant, Indore',
      initial: 'AS',
      rating: 5,
      text: '"MPPSC Mains study materials are always in stock here. Located right under Kautilya Academy — extremely convenient to grab class printouts and test papers on the go."',
    },
    {
      name: 'Priya Patel',
      meta: 'B.Tech Student, DAVV',
      initial: 'PP',
      rating: 5,
      text: '"Ordered a Casio Classwiz calculator + Classmate registers package. Delivered to my hostel in Geeta Bhawan within 3 hours. Fast and very professional service!"',
    },
    {
      name: 'Rahul Verma',
      meta: 'UPSC Aspirant',
      initial: 'RV',
      rating: 5,
      text: '"Great collection of self-help books and stationery. Standard notebooks are cheaper compared to other stores in Bhanwarkuan. Highly recommended!"',
    },
  ];

  return (
    <div className={styles.main}>
      {/* Navigation */}
      <Navbar />

      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Trust Section */}
      <section className={styles.trustSection}>
        <div className="container">
          <div className={styles.trustGrid}>
            {trustItems.map((item, i) => (
              <div key={i} className={styles.trustCard}>
                <div className={styles.trustCardIcon}>{item.icon}</div>
                <div className={styles.trustCardBody}>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Mega Search Console */}
      <section style={{ backgroundColor: '#ffffff', paddingBottom: '40px', paddingTop: '8px' }}>
        <div className="container">
          <MegaSearchConsole />
        </div>
      </section>

      {/* 3.5 Our Journey section */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span className="badge-new" style={{ alignSelf: 'center' }}>Our Journey</span>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Serving Indore Aspirants Since 2005</h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0 }}>
              Vidhya Book Store was founded in a modest Payal Plaza storefront below Kautilya Academy. Our mission has always been simple: to empower civil service aspirants and DAVV semester students by offering 100% genuine study materials, syllabus printouts, and stationery at the most competitive student-friendly rates. Today, we are proud to be trusted by over 50,000 students across Bhanwarkuan.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Categories Grid */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Shop By Category</h2>
              <p className={styles.sectionSubtitle}>Select a section to browse specialized books &amp; resources</p>
            </div>
          </div>
          <div className={styles.categoriesGrid}>
            {[
              { href: '/books?category=Competitive%20Exams',                          icon: <GraduationCap size={22} />, label: 'Competition'  },
              { href: '/books?category=Academic%20Textbooks',                          icon: <Library size={22} />,       label: 'Textbooks'    },
              { href: '/books?category=Stationery',                                   icon: <PenTool size={22} />,       label: 'Stationery'   },
              { href: '/books?category=Novels%20%26%20Literature',                    icon: <BookMarked size={22} />,    label: 'Novels'       },
              { href: '/books?category=Used%20Books',                                  icon: <BadgePercent size={22} />,  label: 'Used Books'   },
              { href: '/books?category=Academic%20Textbooks&subcategory=School',      icon: <BookOpen size={22} />,      label: 'School Core'  },
            ].map((cat, i) => (
              <Link key={i} href={cat.href} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{cat.icon}</div>
                <span className={styles.catTitle}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Collections (Editor's Picks) */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Editor's Picks</h2>
              <p className={styles.sectionSubtitle}>Must-read materials recommended by Kautilya Academy educators</p>
            </div>
            <Link href="/books" className={styles.viewAllLink}>
              <span>View All</span><ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {featuredBooks.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 6. Today's Deals (Flash Deals with Countdown) */}
      <section className={`${styles.sectionPadding} ${styles.dealsSection}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Flash Deals 🔥</h2>
              <p className={styles.sectionSubtitle}>Handpicked student bundles and stationery at heavy discounts</p>
            </div>
            <CountdownTimer />
          </div>
          <div className={styles.booksGrid}>
            {dealsBooks.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 6.5 Today's Trending */}
      {trendingBooks.length > 0 && (
        <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
          <div className="container">
            <div className={styles.sectionTitleContainer}>
              <div>
                <h2 className={styles.sectionTitle}>Today's Trending Books 📈</h2>
                <p className={styles.sectionSubtitle}>The most popular syllabus guides flying off shelves in Indore</p>
              </div>
              <Link href="/books?sort=rating" className={styles.viewAllLink}>
                <span>View Trending</span><ArrowRight size={15} />
              </Link>
            </div>
            <div className={styles.booksGrid}>
              {trendingBooks.map(p => <BookCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* 7. New Arrivals (Recently Added) */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Recently Added 🌟</h2>
              <p className={styles.sectionSubtitle}>Freshly cataloged guides, competitive papers, and stationery</p>
            </div>
            <Link href="/books?sort=newest" className={styles.viewAllLink}>
              <span>Explore New</span><ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {newArrivals.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
      {/* 8. Competitive Exam Spotlight (Popular Competitive Books) */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.spotlightBanner}>
            <div className={styles.spotlightBannerText}>
              <h3>Popular Competitive Books</h3>
              <p>From Laxmikanth Polity and Rajiv Ahir Modern History to official Kautilya Academy publications. Fresh syllabus guides, previous year solved papers, and test series formats.</p>
            </div>
            <Link href="/books?category=Competitive%20Exams" className="btn-accent" style={{ whiteSpace: 'nowrap' }}>
              Browse Exam Books <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {competitiveBooks.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>


      {/* 15. Store Showcase */}
      <section className={`section-padding ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutLayout}>
            {/* Left: Info */}
            <div className={styles.aboutTextCol}>
              <span className="badge-new">STORE PREVIEW</span>
              <h2 className={styles.aboutTitle}>Visit Vidhya Books &amp; Stationery</h2>
              <p className={styles.aboutDescription}>
                A real, brick-and-mortar retail bookstore serving the Indore student community for 20+ years.
                Located right below Kautilya Academy in Payal Plaza, Bhanwarkuan — catering to aspirants of
                all competitive and university exams.
              </p>
              <div className={styles.storeHoursBadge}>
                <Clock size={14} />
                <span>Open Daily: 9:30 AM – 9:30 PM</span>
              </div>
              <div className={styles.aboutContactRow}>
                <MapPin size={16} className={styles.aboutContactIcon} />
                <p>B-6, Payal Plaza, Bhanwarkuan, (Below Kautilya Academy) Indore, MP – 452001</p>
              </div>
              <div className={styles.aboutContactRow}>
                <Phone size={16} className={styles.aboutContactIcon} />
                <p>
                  <a href="tel:9752809717" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>9752809717</a>
                  {' '}(Call / WhatsApp)
                </p>
              </div>
              <div className={styles.aboutActions}>
                <a href="https://maps.google.com/?q=Vidhya+Book+Store+Bhanwarkuan+Indore" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.88rem', padding: '10px 20px' }}>
                  <Compass size={15} /> Open in Maps
                </a>
                <a href="https://wa.me/919752809717" target="_blank" rel="noopener noreferrer" className="btn-accent" style={{ fontSize: '0.88rem', padding: '10px 20px', background: '#25d366', color: 'white', boxShadow: 'none' }}>
                  <MessageSquare size={15} /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right: Masonry Gallery */}
            <div className={styles.aboutImagesCol}>
              <div className={styles.aboutImageWrapper}>
                <img src="/images/storefront_entry.jpg" alt="Vidhya Book Store Entrance" className={styles.aboutImage} />
                <span className={styles.imageCaption}>Store Entrance — Payal Plaza</span>
              </div>
              <div className={styles.aboutImageWrapper}>
                <img src="/images/bookshelves.jpg" alt="Vidhya Book Store Bookshelves" className={styles.aboutImage} />
                <span className={styles.imageCaption}>Competitive Exam Bookshelves</span>
              </div>
              <div className={styles.aboutImageWrapper}>
                <img src="/images/shop_interior.jpg" alt="Vidhya Book Store Interior" className={styles.aboutImage} />
                <span className={styles.imageCaption}>Shop Interior &amp; Counter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16. Google Reviews */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>What Students Say</h2>
              <p className={styles.sectionSubtitle}>Real reviews from successful students &amp; aspirants in Indore</p>
            </div>
          </div>

          {/* Google Rating Summary */}
          <div className={styles.googleRatingRow}>
            <span className={styles.googleRatingScore}>4.9</span>
            <div>
              <div className={styles.googleStarsRow}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FCD116" stroke="none" />)}
              </div>
              <p className={styles.googleRatingMeta}>Based on 200+ Google Reviews</p>
            </div>
            <div className={styles.googleBadge}>
              <Star size={12} fill="#FCD116" stroke="none" />
              Google Reviews
            </div>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>



      {/* 18. FAQ */}
      <section className={`${styles.sectionPadding} ${styles.faqSection}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer} style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '48px' }}>
            <div>
              <h2 className={styles.sectionTitle} style={{ display: 'inline-block' }}>Frequently Asked Questions</h2>
              <p className={styles.sectionSubtitle}>Find instant answers to common student &amp; trading queries</p>
            </div>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* 19. Newsletter */}
      <section className={styles.newsletterSection}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <Mail size={36} style={{ color: 'var(--color-accent-yellow)' }} />
            <h2 className={styles.newsletterTitle}>Join Indore's Aspirants Club</h2>
            <p className={styles.newsletterDesc}>
              Subscribe for exam schedules, syllabus updates, book stock alerts, and special stationery discount coupons.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* 20. Google Map */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Find Our Indore Store 📍</h2>
              <p className={styles.sectionSubtitle}>Get easy directions to Payal Plaza outlet below Kautilya Academy</p>
            </div>
          </div>
          <div className={styles.mapGrid}>
            <div className={styles.mapEmbedFrame}>
              <iframe
                title="Vidhya Book Store Google Location Map"
                src="https://maps.google.com/maps?q=Kautilya%20Academy%20Bhanwarkua%20Indore&t=&z=16&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className={styles.mapDetailsCard}>
              <h3 className={styles.mapDetailsTitle}>Location Details</h3>
              <div className={styles.mapDetailRow}>
                <MapPin size={18} className={styles.mapDetailIcon} />
                <span>
                  <strong>Store Address:</strong><br />
                  B-6, Payal Plaza, Bhanwarkuan,<br />
                  (Below Kautilya Academy)<br />
                  Indore, Madhya Pradesh – 452001
                </span>
              </div>
              <div className={styles.mapDetailRow}>
                <Phone size={16} className={styles.mapDetailIcon} />
                <span>
                  <strong>Call / WhatsApp:</strong>{' '}
                  <a href="tel:9752809717" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>9752809717</a>
                </span>
              </div>
              <div className={styles.mapDetailRow}>
                <Send size={16} className={styles.mapDetailIcon} />
                <span>
                  <strong>Telegram:</strong>{' '}
                  <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>8982883332</a>
                </span>
              </div>
              <div className={styles.mapDetailRow}>
                <Clock size={16} className={styles.mapDetailIcon} />
                <span><strong>Store Hours:</strong> Open Daily 9:30 AM – 9:30 PM</span>
              </div>
              <div className={styles.directionButtons}>
                <a
                  href="https://maps.google.com/?q=Vidhya+Book+Store+Bhanwarkuan+Indore"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 20px' }}
                >
                  <Compass size={15} /> Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />



      {/* Conversion Booster popups */}
      <ConversionBoosters />
      <StudentHub />
    </div>
  );
}


