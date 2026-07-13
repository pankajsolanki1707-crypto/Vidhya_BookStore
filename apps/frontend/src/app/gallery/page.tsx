import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../info.module.css';

export default function GalleryPage() {
  const images = [
    {
      src: '/images/store_banner.png',
      title: 'Official Store Banner',
      desc: 'Vidya Books & Stationery storefront banner (Payal Plaza, Bhanwarkuan, Indore)'
    },
    {
      src: '/images/storefront_entry.jpg',
      title: 'Storefront Entrance Outlet',
      desc: 'Our physical storefront below Kautilya Academy in Indore'
    },
    {
      src: '/images/shop_interior.jpg',
      title: 'Shop Interior Counter & Displays',
      desc: 'Customer counter, colorful pen displays, registers, and study guides'
    },
    {
      src: '/images/bookshelves.jpg',
      title: 'Full Bookshelves Stacks',
      desc: 'Deep shelves stacked to the brim with MPPSC, UPSC, and DAVV textbooks'
    }
  ];

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Vidhya Store Gallery</h1>
            <p className={styles.pageSubtitle}>Take a look inside our retail outlet below Kautilya Academy, Bhanwarkuan</p>
          </div>

          {/* Gallery Grid */}
          <div className={styles.galleryGrid}>
            {images.map((img, index) => (
              <div key={index} className={styles.galleryCard}>
                <div style={{ overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}>
                  <img src={img.src} alt={img.title} className={styles.galleryImg} />
                </div>
                <div className={styles.galleryInfo}>
                  <h4 className={styles.galleryTitle}>{img.title}</h4>
                  <p className={styles.pageSubtitle} style={{ marginTop: '4px', fontSize: '0.75rem' }}>{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
