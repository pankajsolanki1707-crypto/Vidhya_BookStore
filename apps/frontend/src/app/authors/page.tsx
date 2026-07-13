import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../info.module.css';

export default function AuthorsPage() {
  const authors = [
    { name: 'M. Laxmikanth', count: 'Indian Polity Guides', desc: 'Renowned expert on Indian Constitution and Civil Services polity preparation.' },
    { name: 'Dr. H.C. Verma', count: 'Concepts of Physics', desc: 'Respected professor and author of fundamental physics books for IIT JEE & Engineering.' },
    { name: 'James Clear', count: 'Self-Help & Habits', desc: 'Keynote speaker and author of global bestseller Atomic Habits.' },
    { name: 'Amish Tripathi', count: 'Indian Mythology Fiction', desc: 'Popular fiction novelist known for Shiva Trilogy and Ram Chandra Series.' },
    { name: 'Philip Kotler', count: 'Marketing Textbooks', desc: 'Distinguished marketing professor, considered the Father of Modern Marketing.' },
    { name: 'Rajiv Ahir (IPS)', count: 'History Guides', desc: 'UPSC scholar and modern India history textbook author.' }
  ];

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Popular Authors</h1>
            <p className={styles.pageSubtitle}>Browse academic and competitive preparation books by leading educators & scholars</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {authors.map((author, index) => (
              <div key={index} style={{ backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700 }}>
                  {author.count}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  <Link href={`/books?query=${encodeURIComponent(author.name)}`}>
                    {author.name}
                  </Link>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  {author.desc}
                </p>
                <Link href={`/books?query=${encodeURIComponent(author.name)}`} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: 'auto', display: 'inline-flex', alignItems: 'center' }}>
                  View Books →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
