'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, RefreshCw, Compass } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console/monitoring service
    console.error('System crash captured by Next.js Error boundary:', error);
  }, [error]);

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
            backgroundColor: '#fee2e2',
            color: 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <ShieldAlert size={40} />
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: 'var(--color-error)',
            margin: 0,
            lineHeight: 1
          }}>
            500
          </h1>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            margin: 0
          }}>
            Internal Database System Crash
          </h2>

          <p style={{
            fontSize: '0.92rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            margin: 0
          }}>
            Something went wrong while compiling catalog modules or processing your purchase ledger. The system has automatically logged this incident.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            marginTop: '10px'
          }}>
            <button 
              onClick={() => reset()} 
              className="btn-accent"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 24px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} /> Try Reloading Component
            </button>
            
            <a 
              href="/" 
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 24px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <Compass size={16} /> Return to Homepage
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
