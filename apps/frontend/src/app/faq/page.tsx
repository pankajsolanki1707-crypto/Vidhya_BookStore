import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FaqAccordion from '@/components/FaqAccordion/FaqAccordion';
import styles from '../info.module.css';

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where is Vidhya Book Store located in Indore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We are located at B-6, Payal Plaza, right below Kautilya Academy on Bhanwarkuan Main Road, Indore, Madhya Pradesh."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer home delivery in Indore hostels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer super fast same-day or next-day runner deliveries directly to student libraries, desks, hostels, and rooms in Bhanwarkuan, Navlakha, Geeta Bhawan, and nearby Indore zones."
        }
      },
      {
        "@type": "Question",
        "name": "Can I trade or sell my old competitive books?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we accept used MPPSC, UPSC, and college textbooks. You can consign them with us or trade them for store credits towards brand new study materials."
        }
      }
    ]
  };

  return (
    <div className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
