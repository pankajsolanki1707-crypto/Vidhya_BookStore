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
import { 
  ArrowRight, GraduationCap, PenTool, BookOpen, Quote, Star, 
  MapPin, Phone, Send, ShieldCheck, Heart, Library, BadgePercent, 
  BookMarked, HelpCircle, CheckCircle, Mail, Compass 
} from 'lucide-react';
import styles from './home.module.css';

export default function Home() {
  const products = getProducts();

  // Filter products by home sections
  const featuredBooks = products.filter(p => p.featured).slice(0, 4);
  const dealsBooks = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  
  // Specific Category focuses
  const competitiveBooks = products.filter(p => p.category === 'Competitive Exams').slice(0, 4);
  const academicBooks = products.filter(p => p.category === 'Academic Textbooks').slice(0, 4);
  const usedBooks = products.filter(p => p.category === 'Used Books').slice(0, 4);
  const stationeryItems = products.filter(p => p.category === 'Stationery').slice(0, 4);

  // Popular authors list
  const popularAuthors = [
    { name: 'M. Laxmikanth', initial: 'ML', desc: 'Indian Polity Author' },
    { name: 'Dr. H.C. Verma', initial: 'HV', desc: 'Conceptual Physics' },
    { name: 'James Clear', initial: 'JC', desc: 'Atomic Habits Author' },
    { name: 'Amish Tripathi', initial: 'AT', desc: 'Shiva Trilogy Fiction' },
    { name: 'Philip Kotler', initial: 'PK', desc: 'Marketing Management' }
  ];

  // Publishers list
  const publishers = [
    'McGraw Hill',
    'S. Chand Publishing',
    'Kautilya Academy Publications',
    'Mahaveer Publication',
    'Pearson Education'
  ];

  return (
    <div className={styles.main}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Banner */}
      <Hero />

      {/* 2. Mega Search Console Section */}
      <section style={{ backgroundColor: '#ffffff', paddingBottom: '30px' }}>
        <div className="container">
          <MegaSearchConsole />
        </div>
      </section>

      {/* 3. Categories Matrix Grid */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Shop By Category</h2>
              <p className={styles.sectionSubtitle}>Select a section to browse specialized booklets & resources</p>
            </div>
          </div>

          <div className={styles.categoriesGrid}>
            <Link href="/books?category=Competitive%20Exams" className={styles.categoryCard}>
              <div className={styles.categoryIcon}><GraduationCap size={20} /></div>
              <span className={styles.catTitle}>Competition</span>
            </Link>
            <Link href="/books?category=Academic%20Textbooks" className={styles.categoryCard}>
              <div className={styles.categoryIcon}><Library size={20} /></div>
              <span className={styles.catTitle}>Textbooks</span>
            </Link>
            <Link href="/books?category=Stationery" className={styles.categoryCard}>
              <div className={styles.categoryIcon}><PenTool size={20} /></div>
              <span className={styles.catTitle}>Stationery</span>
            </Link>
            <Link href="/books?category=Novels%20%26%20Literature" className={styles.categoryCard}>
              <div className={styles.categoryIcon}><BookMarked size={20} /></div>
              <span className={styles.catTitle}>Novels</span>
            </Link>
            <Link href="/books?category=Used%20Books" className={styles.categoryCard}>
              <div className={styles.categoryIcon}><BadgePercent size={20} /></div>
              <span className={styles.catTitle}>Used Books</span>
            </Link>
            <Link href="/books?category=Academic%20Textbooks&subcategory=School" className={styles.categoryCard}>
              <div className={styles.categoryIcon}><BookOpen size={20} /></div>
              <span className={styles.catTitle}>School Core</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Today's Deals (with Countdown timer) */}
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
            {dealsBooks.map(product => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Books Section */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Collections</h2>
              <p className={styles.sectionSubtitle}>Must-read materials recommended by Kautilya Academy educators</p>
            </div>
            <Link href="/books" className={styles.viewAllLink}>
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.booksGrid}>
            {featuredBooks.map(product => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>New Arrivals 🌟</h2>
              <p className={styles.sectionSubtitle}>Freshly cataloged guides, competitive papers, and stationery</p>
            </div>
            <Link href="/books?sort=newest" className={styles.viewAllLink}>
              <span>Explore New</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.booksGrid}>
            {newArrivals.map(product => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Competitive Exam Focus Spotlight */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.spotlightBanner}>
            <div className={styles.spotlightBannerText}>
              <h3>UPSC, MPPSC & Competitive Exams hub</h3>
              <p>
                From Laxmikanth Polity and Rajiv Ahir Modern History to official Kautilya Academy publications. We stock fresh syllabus guides, previous years solved papers, and test series formats.
              </p>
            </div>
            <Link href="/books?category=Competitive%20Exams" className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Browse Exam Books</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.booksGrid}>
            {competitiveBooks.map(product => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. College & Academic Spotlight (BBA/MBA/Engineering/Medical/Law) */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>College & University Textbooks</h2>
              <p className={styles.sectionSubtitle}>Textbooks for DAVV semesters: Engineering, Medical, BBA, MBA, B.Pharm, CLAT Law</p>
            </div>
            <Link href="/books?category=Academic%20Textbooks" className={styles.viewAllLink}>
              <span>Browse All Textbooks</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.booksGrid}>
            {academicBooks.map(product => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Used Books Spotlight (Buy / Sell Old Books) */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.spotlightBanner} style={{ background: 'linear-gradient(to right, #1e293b, #0f172a)', borderLeft: '6px solid var(--color-accent-yellow)' }}>
            <div className={styles.spotlightBannerText}>
              <h3 style={{ color: 'var(--color-accent-yellow)' }}>🔄 Buy & Sell Used Books</h3>
              <p>
                We promote sustainable study! Bring your pre-owned engineering courses, school textbooks, or UPSC prep materials. Sell them to us for cash, or buy secondhand verified copies at up to 60% discount!
              </p>
            </div>
            <a href="tel:9752809717" className="btn-accent" style={{ color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Get Cash for Old Books</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className={styles.booksGrid}>
            {usedBooks.map(product => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Stationery Store Spotlight */}
      <section className={styles.sectionPadding} style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Vidhya Premium Stationery Store</h2>
              <p className={styles.sectionSubtitle}>Casio scientific calculators, Luxor Parker pens, high-quality registers, spiral notebooks</p>
            </div>
            <Link href="/books?category=Stationery" className={styles.viewAllLink}>
              <span>Shop Stationery</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.booksGrid}>
            {stationeryItems.map(product => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>





      {/* 14. Store Gallery (Actual Store Photos) */}
      <section className={`section-padding ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutLayout}>
            {/* Left Col: Info & Services */}
            <div className={styles.aboutTextCol}>
              <span className="badge-new" style={{ color: '#ffffff', backgroundColor: 'var(--color-primary)' }}>STORE PREVIEW</span>
              <h2 className={styles.aboutTitle}>Visit Vidhya Books & Stationery</h2>
              <p className={styles.aboutDescription}>
                We are a real, brick-and-mortar retail bookstore serving the Indore student community for years. Located right below Kautilya Academy in Payal Plaza, Bhanwarkuan, we cater to aspirants of all competitive and university exams.
              </p>

              <div className={styles.whyGrid} style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <MapPin size={16} className={styles.whyIcon} />
                  <p className={styles.whyText}>B-6, Payal Plaza, Bhanwarkuan, Indore</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Phone size={16} className={styles.whyIcon} />
                  <p className={styles.whyText}>9752809717 (Call/WhatsApp)</p>
                </div>
              </div>
            </div>

            {/* Right Col: Actual Store Photos */}
            <div className={styles.aboutImagesCol}>
              <div className={styles.aboutImageWrapper}>
                <img
                  src="/images/shop_interior.jpg"
                  alt="Vidhya Books & Stationery Counter and Pen Displays"
                  className={styles.aboutImage}
                />
                <span className={styles.imageCaption}>Shop Interior & Customer Desk</span>
              </div>
              <div className={styles.aboutImageWrapper}>
                <img
                  src="/images/bookshelves.jpg"
                  alt="Vidhya Books Bookshelves stacked with Competitive Exam Materials"
                  className={styles.aboutImage}
                />
                <span className={styles.imageCaption}>Bookshelves Stacks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. Google Reviews & Testimonials */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Aspirant Testimonials</h2>
              <p className={styles.sectionSubtitle}>Real feedback from successful students in Indore</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
              <span>Google Review Rating: <strong>4.9 ★</strong></span>
            </div>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <span className={styles.reviewStars}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FCD116" stroke="none" />)}
              </span>
              <p className={styles.reviewText}>
                "The study materials for MPPSC Mains are always in stock here. Since they are located right under Kautilya Academy, it is extremely convenient to grab class printouts and test papers."
              </p>
              <div className={styles.reviewer}>
                <span className={styles.reviewerName}>Aditya Sharma</span>
                <span className={styles.reviewerMeta}>MPPSC Aspirant, Indore</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <span className={styles.reviewStars}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FCD116" stroke="none" />)}
              </span>
              <p className={styles.reviewText}>
                "I ordered a Casio Classwiz calculator and Classmate registers package. It got delivered to my hostel in Geeta Bhawan within 3 hours. Fast and professional service!"
              </p>
              <div className={styles.reviewer}>
                <span className={styles.reviewerName}>Priya Patel</span>
                <span className={styles.reviewerMeta}>B.Tech Student, DAVV</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <span className={styles.reviewStars}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FCD116" stroke="none" />)}
              </span>
              <p className={styles.reviewText}>
                "Vidhya Book Store has a great collection of self-help books and stationery. Standard notebooks are cheaper compared to other stores in Bhanwarkuan. Highly recommended!"
              </p>
              <div className={styles.reviewer}>
                <span className={styles.reviewerName}>Rahul Verma</span>
                <span className={styles.reviewerMeta}>UPSC Aspirant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16. FAQ Section */}
      <section className={`${styles.sectionPadding} ${styles.faqSection}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer} style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>
            <div>
              <h2 className={styles.sectionTitle} style={{ display: 'inline-block' }}>Frequently Asked Questions</h2>
              <p className={styles.sectionSubtitle}>Find instant answers to common student & trading queries</p>
            </div>
          </div>

          <FaqAccordion />
        </div>
      </section>



      {/* 18. Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <Mail size={32} className={styles.whyIcon} style={{ color: 'var(--color-accent-yellow)' }} />
            <h2 className={styles.newsletterTitle}>Join Indore's Aspirants Club</h2>
            <p className={styles.newsletterDesc}>
              Subscribe to get notified about upcoming competitive exam schedules, syllabus updates, book stocks alert, and special stationary discount coupons.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* 19. Google Location Map & Store directions */}
      <section className={styles.sectionPadding}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <div>
              <h2 className={styles.sectionTitle}>Find Our Indore Store 📍</h2>
              <p className={styles.sectionSubtitle}>Get easy directions to visit our Payal Plaza outlet below Kautilya Academy</p>
            </div>
          </div>

          <div className={styles.mapGrid}>
            {/* Left Col: Embedded Map */}
            <div className={styles.mapEmbedFrame}>
              <iframe
                title="Vidhya Book Store Google Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3681.3323032549247!2d75.86536097587848!3d22.697262079401763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m2!2zMjLCsDQxJzUwLjEiTiA3NSI1MicwNC42IkU!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Right Col: Direction Cards */}
            <div className={styles.mapDetailsCard}>
              <h3 className={styles.mapDetailsTitle}>Location Details</h3>
              
              <div className={styles.mapDetailRow}>
                <MapPin size={24} className={styles.mapDetailIcon} />
                <span>
                  <strong>Store Address:</strong><br />
                  B-6, Payal Plaza, Bhanwarkuan,<br />
                  (Kautilya Academy ke niche)<br />
                  Indore, Madhya Pradesh - 452001
                </span>
              </div>

              <div className={styles.mapDetailRow}>
                <Phone size={18} className={styles.mapDetailIcon} />
                <span>
                  <strong>Call support:</strong> <a href="tel:9752809717" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>9752809717</a>
                </span>
              </div>

              <div className={styles.mapDetailRow}>
                <Send size={18} className={styles.mapDetailIcon} />
                <span>
                  <strong>Telegram Support:</strong> <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>8982883332</a>
                </span>
              </div>

              <div className={styles.directionButtons}>
                <a
                  href="https://maps.google.com/?q=Vidhya+Book+Store+Bhanwarkuan+Indore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Compass size={16} />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
