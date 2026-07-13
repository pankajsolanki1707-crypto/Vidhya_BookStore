'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft, BookOpen, Compass } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-premium)',
          padding: '48px',
          maxWidth: '540px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <HelpCircle size={40} />
          </div>

          <h1 style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: 'var(--color-primary)',
            margin: 0,
            lineHeight: 1
          }}>
            404
          </h1>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            margin: 0
          }}>
            Catalog Sheet Not Found
          </h2>

          <p style={{
            fontSize: '0.92rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            margin: 0
          }}>
            We couldn't locate the guide book or resource you are looking for. It might have been re-cataloged, sold out, or moved to a different syllabus shelf.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            marginTop: '10px'
          }}>
            <Link 
              href="/books" 
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 24px',
                fontWeight: 700
              }}
            >
              <BookOpen size={16} /> Browse Books Catalog
            </Link>
            
            <Link 
              href="/" 
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 24px',
                fontWeight: 700
              }}
            >
              <Compass size={16} /> Return to Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
