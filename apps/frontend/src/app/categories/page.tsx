import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { GraduationCap, Library, PenTool, BookOpen, Heart, Bookmark } from 'lucide-react';
import styles from '../info.module.css';

export default function CategoriesPage() {
  const categoryTree = [
    {
      name: 'Competitive Exams',
      icon: <GraduationCap size={24} />,
      desc: 'Top-tier preparation guides, academy lecture prints, and past exams papers.',
      subcategories: ['MPPSC', 'UPSC', 'SSC', 'Banking', 'Railway', 'Vyapam']
    },
    {
      name: 'Academic Textbooks',
      icon: <Library size={24} />,
      desc: 'DAVV course syllabus publications and standard university study references.',
      subcategories: ['Engineering', 'Medical', 'MBA', 'BBA', 'Law', 'School']
    },
    {
      name: 'Stationery',
      icon: <PenTool size={24} />,
      desc: 'Casio calculators, drawing instruments, and high-grade student register bundles.',
      subcategories: ['Calculators', 'Premium Pens', 'Notebooks', 'Office Supplies']
    },
    {
      name: 'Novels & Literature',
      icon: <BookOpen size={24} />,
      desc: 'Mindfulness guides, self-help masterclasses, and children story books.',
      subcategories: ['Self-Help', 'Fiction', 'Children']
    },
    {
      name: 'Used Books',
      icon: <Bookmark size={24} />,
      desc: 'Pre-owned school, college, and exam textbooks at 50% discount.',
      subcategories: ['MPPSC', 'UPSC', 'Engineering', 'Medical']
    }
  ];

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Explore Book Categories</h1>
            <p className={styles.pageSubtitle}>Select a category or subcategory to see available inventory</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
            {categoryTree.map((cat, index) => (
              <div key={index} style={{ backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '30px', display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '16px', borderRadius: '50%' }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    <Link href={`/books?category=${encodeURIComponent(cat.name)}`}>
                      {cat.name}
                    </Link>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px', marginBottom: '16px', lineHeight: 1.5 }}>
                    {cat.desc}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {cat.subcategories.map((sub, i) => (
                      <Link
                        key={i}
                        href={`/books?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-full)',
                          padding: '6px 14px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--color-text-main)',
                          transition: 'var(--transition-fast)'
                        }}
                        className="cat-sub-link"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
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
