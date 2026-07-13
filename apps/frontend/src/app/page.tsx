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
import {
  ArrowRight, GraduationCap, PenTool, BookOpen, Star,
  MapPin, Phone, Send, ShieldCheck, BadgePercent,
  BookMarked, CheckCircle, Mail, Compass, Truck, RotateCcw,
  Library, Clock, MessageSquare, FileText, ShoppingBag
} from 'lucide-react';

import styles from './home.module.css';


export default function Home() {
  const products = getProducts();

  const featuredBooks    = products.filter(p => p.featured).slice(0, 4);
  const dealsBooks       = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);
  const newArrivals      = products.filter(p => p.isNewArrival).slice(0, 4);
  const competitiveBooks = products.filter(p => p.category === 'Competitive Exams').slice(0, 4);
  const academicBooks    = products.filter(p => p.category === 'Academic Textbooks').slice(0, 4);
  const usedBooks        = products.filter(p => p.category === 'Used Books').slice(0, 4);
  const stationeryItems  = products.filter(p => p.category === 'Stationery').slice(0, 4);

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

      {/* 5. Featured Collections */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Collections</h2>
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

      {/* 6. Today's Deals (with Countdown) */}
      <section className={`${styles.sectionPadding} ${styles.dealsSection}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Today's Hot Deals 🔥</h2>
              <p className={styles.sectionSubtitle}>Handpicked student bundles and stationery at heavy discounts</p>
            </div>
            <CountdownTimer />
          </div>
          <div className={styles.booksGrid}>
            {dealsBooks.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>New Arrivals 🌟</h2>
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

      {/* 8. Competitive Exam Spotlight */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.spotlightBanner}>
            <div className={styles.spotlightBannerText}>
              <h3>UPSC, MPPSC &amp; Competitive Exam Hub</h3>
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

      {/* 9. College & Academic */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>College &amp; University Textbooks</h2>
              <p className={styles.sectionSubtitle}>DAVV semesters: Engineering, Medical, BBA, MBA, B.Pharm, CLAT Law</p>
            </div>
            <Link href="/books?category=Academic%20Textbooks" className={styles.viewAllLink}>
              <span>Browse All Textbooks</span><ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {academicBooks.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 10. Used Books Spotlight */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.spotlightBanner} style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderLeft: '5px solid var(--color-accent-yellow)' }}>
            <div className={styles.spotlightBannerText}>
              <h3>🔄 Buy &amp; Sell Used Books</h3>
              <p>Bring pre-owned engineering textbooks, school books, or UPSC prep materials. Sell them for cash or buy verified secondhand copies at up to 60% discount!</p>
            </div>
            <a href="tel:9752809717" className="btn-accent" style={{ whiteSpace: 'nowrap' }}>
              Get Cash for Old Books <ArrowRight size={16} />
            </a>
          </div>
          <div className={styles.booksGrid}>
            {usedBooks.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 11. Stationery */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Vidhya Premium Stationery Store</h2>
              <p className={styles.sectionSubtitle}>Casio scientific calculators, Luxor Parker pens, high-quality registers, spiral notebooks</p>
            </div>
            <Link href="/books?category=Stationery" className={styles.viewAllLink}>
              <span>Shop Stationery</span><ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {stationeryItems.map(p => <BookCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 12. Why Choose Us */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Why Choose Vidhya Book Store?</h2>
              <p className={styles.sectionSubtitle}>Benefits loved by Indore students &amp; coaching centers for 20+ years</p>
            </div>
          </div>
          <div className={styles.whyGrid}>
            {[
              { icon: <CheckCircle size={24} />, title: '100% Genuine Copies',      text: 'Direct publications supply. No pirated prints. Sourced officially.' },
              { icon: <BadgePercent size={24} />, title: 'Student Discounts',        text: 'Consistent discounts on competitive, novels, and stationery.' },
              { icon: <Send size={24} />,        title: 'Same-Day Indore Shipping', text: 'Delivering to Bhanwarkuan, Geeta Bhawan, Navlakha, and hostels.' },
              { icon: <CheckCircle size={24} />, title: 'Used Books Buy/Sell',      text: 'Sustainable trades. Swap old semester guides for study points.' },
            ].map((w, i) => (
              <div key={i} className={styles.whyCard}>
                <div className={styles.whyIconWrap}>
                  <span className={styles.whyIcon}>{w.icon}</span>
                </div>
                <h3 className={styles.whyTitle}>{w.title}</h3>
                <p className={styles.whyText}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Popular Authors */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Popular Authors</h2>
              <p className={styles.sectionSubtitle}>Explore core guides by leading experts &amp; educators</p>
            </div>
          </div>
          <div className={styles.authorsGrid}>
            {popularAuthors.map((author, i) => (
              <div key={i} className={styles.authorCard}>
                <div className={styles.authorAvatar}>{author.initial}</div>
                <h4 className={styles.authorName}>{author.name}</h4>
                <p className={styles.sectionSubtitle} style={{ marginTop: 0, fontSize: '0.75rem' }}>{author.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Official Publishers */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Official Publishers</h2>
              <p className={styles.sectionSubtitle}>100% genuine prints sourced directly from authorized publications</p>
            </div>
          </div>
          <div className={styles.publishersGrid}>
            {publishers.map((pub, i) => (
              <div key={i} className={styles.publisherCard}>{pub}</div>
            ))}
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

          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.reviewStars}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#FCD116" stroke="none" />)}
                </div>
                <p className={styles.reviewText}>{t.text}</p>
                <div className={styles.reviewer}>
                  <div className={styles.reviewerAvatar}>{t.initial}</div>
                  <div className={styles.reviewerInfo}>
                    <span className={styles.reviewerName}>{t.name}</span>
                    <span className={styles.reviewerMeta}>{t.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17. Community Feed */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>#VidhyaAspirants Feed 📸</h2>
              <p className={styles.sectionSubtitle}>Follow our community for UPSC quotes, study hacks &amp; new stock alerts</p>
            </div>
          </div>
          <div className={styles.instagramGrid}>
            {[
              { src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=60', label: 'UPSC Focus 🎯' },
              { src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60', label: 'MP GK Guides 🗺️' },
              { src: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&auto=format&fit=crop&q=60', label: 'Classmate Packs ✏️' },
              { src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=60', label: 'Self-Help Books 📖' },
              { src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=60', label: 'Indore Deliveries ⚡' },
              { src: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=60', label: 'Aspirant Goals 🏆' },
            ].map((item, i) => (
              <div key={i} className={styles.instagramCard}>
                <img src={item.src} alt={item.label} className={styles.instagramImg} />
                <div className={styles.instagramOverlay}>{item.label}</div>
              </div>
            ))}
          </div>
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

      {/* Floating WhatsApp FAB */}
      <a
        href="https://wa.me/919752809717"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappFab}
        aria-label="Chat on WhatsApp"
      >
        {/* Official WhatsApp SVG logo */}
        <svg className={styles.whatsappFabIcon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.2"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M16 5C10.477 5 6 9.477 6 15c0 1.9.53 3.674 1.448 5.19L6 26l5.978-1.424A10.003 10.003 0 0016 25c5.523 0 10-4.477 10-10S21.523 5 16 5zm-3.47 5.714c-.2-.445-.41-.454-.6-.462-.155-.006-.332-.006-.51-.006-.177 0-.465.066-.71.332-.244.266-.932.91-.932 2.22s.954 2.575 1.088 2.753c.132.177 1.843 2.964 4.564 4.038 2.253.89 2.72.713 3.21.668.489-.044 1.578-.645 1.8-1.267.222-.622.222-1.155.155-1.267-.066-.111-.244-.177-.51-.31-.267-.133-1.578-.778-1.822-.866-.244-.089-.422-.133-.6.133-.177.267-.688.867-.843 1.044-.155.178-.31.2-.577.067-.267-.134-1.127-.415-2.146-1.322-.793-.707-1.328-1.58-1.484-1.847-.155-.266-.017-.41.117-.543.12-.12.266-.31.4-.465.133-.155.177-.266.266-.444.089-.178.044-.333-.022-.466-.067-.133-.578-1.445-.793-1.977z" fill="white"/>
        </svg>
        <span className={styles.whatsappFabLabel}>Chat with Us</span>
      </a>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile bottom navigation">
        <div className={styles.mobileNavGrid}>
          <a href="/" className={`${styles.mobileNavItem} ${styles.active}`}>
            <BookOpen size={20} className={styles.mobileNavIcon} />
            Home
          </a>
          <a href="/books" className={styles.mobileNavItem}>
            <Library size={20} className={styles.mobileNavIcon} />
            Books
          </a>
          <a href="/cart" className={styles.mobileNavItem}>
            <BadgePercent size={20} className={styles.mobileNavIcon} />
            Cart
          </a>
          <a href="/contact" className={styles.mobileNavItem}>
            <Phone size={20} className={styles.mobileNavIcon} />
            Contact
          </a>
        </div>
      </nav>

      {/* Conversion Booster popups */}
      <ConversionBoosters />
      <StudentHub />
    </div>
  );
}


