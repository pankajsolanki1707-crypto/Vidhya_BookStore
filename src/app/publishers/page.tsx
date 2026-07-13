import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../info.module.css';

export default function PublishersPage() {
  const publishers = [
    { name: 'Kautilya Academy Publications', desc: 'Indore\'s local MPPSC civil services material prints provider.' },
    { name: 'McGraw Hill', desc: 'Top UPSC civil service guides and engineering research textbooks.' },
    { name: 'S. Chand Publishing', desc: 'Renowned school textbooks and competitive aptitude practice guides.' },
    { name: 'Mahaveer Publication', desc: 'Popular regional MP GK study references for competitive exams.' },
    { name: 'Pearson Education', desc: 'Distinguished university semester courses and MBA management papers.' },
    { name: 'Eastern Book Company', desc: 'Premier law books and CLAT judicial examinations series.' }
  ];

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Official Publishers</h1>
            <p className={styles.pageSubtitle}>Genuine copies sourced directly from authorized publishing houses</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {publishers.map((pub, index) => (
              <div key={index} style={{ backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  <Link href={`/books?query=${encodeURIComponent(pub.name)}`}>
                    {pub.name}
                  </Link>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  {pub.desc}
                </p>
                <Link href={`/books?query=${encodeURIComponent(pub.name)}`} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: 'auto', display: 'inline-flex', alignItems: 'center' }}>
                  Browse Publisher Books →
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
