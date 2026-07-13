'use client';

import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../info.module.css';

export default function BlogsPage() {
  const posts = [
    {
      title: 'How to Kickstart Your MPPSC Prelims & Mains Preparation in Indore',
      date: 'July 10, 2026',
      author: 'Vidhya Education Board',
      img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60',
      snippet: 'Bhanwarkuan is the coaching epicentre of Madhya Pradesh. Learn how to draft your study plan, choose between various academy materials, and select the right reference guides...'
    },
    {
      title: 'Top 5 Essential Reference Books for UPSC Civil Services Polity & History',
      date: 'June 28, 2026',
      author: 'UPSC Aspirant Forum',
      img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
      snippet: 'From M. Laxmikanth\'s 7th Edition Indian Polity to Spectrum\'s Modern History by Rajiv Ahir. We review the core textbooks that every civil services aspirant must have on their shelves...'
    },
    {
      title: 'Premium Stationery Checklist: Best Tools for Engineering and Architecture DAVV Students',
      date: 'June 15, 2026',
      author: 'Indore Stationery Reviews',
      img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=60',
      snippet: 'A look into scientific calculators (fx-991EX ClassWiz), drafting boards, premium Parker Vector ballpens, and Classmate registers packs. Find where to get them cheap in Indore...'
    }
  ];

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Vidhya Bookstore Blogs</h1>
            <p className={styles.pageSubtitle}>Latest study resources reviews, coaching highlights, and exam syllabus tips</p>
          </div>

          <div className={styles.blogsGrid}>
            {posts.map((post, i) => (
              <div key={i} className={styles.blogCard}>
                <img src={post.img} alt={post.title} className={styles.blogImg} />
                <div className={styles.blogBody}>
                  <span className={styles.blogMeta}>{post.date} | By {post.author}</span>
                  <h3 className={styles.blogTitle}>{post.title}</h3>
                  <p className={styles.blogSnippet}>{post.snippet}</p>
                  <button className={styles.blogLink} onClick={() => alert('Full blog posts are coming soon! Keep studying! 📚')}>
                    Read Full Post →
                  </button>
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
