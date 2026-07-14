'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { BookOpen, Library, ShoppingCart, Phone, MessageSquare } from 'lucide-react';

export default function GlobalMobileBars() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 999,
        pointerEvents: 'auto'
      }} className="mobile-only-fab-container">
        
        {/* Call button */}
        <a
          href="tel:9752809717"
          className="call-fab-button"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(33,61,143,0.3)',
            transition: 'transform 0.2s',
            border: '1.5px solid rgba(255,255,255,0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Call Bookstore Support"
        >
          <Phone size={20} />
        </a>

        {/* WhatsApp button */}
        <a
          href="https://wa.me/919752809717"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-fab-button"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#25d366',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
            transition: 'transform 0.2s',
            border: '1.5px solid rgba(255,255,255,0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Chat on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '22px', height: '22px' }}>
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        height: '64px',
        zIndex: 9999,
        display: 'none' // default hidden, displayed via CSS on mobile
      }} className="global-mobile-bottom-nav">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          height: '100%',
          alignItems: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: pathname === '/' ? 700 : 500,
              color: pathname === '/' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={20} />
            <span>Home</span>
          </Link>

          <Link
            href="/books"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: pathname?.startsWith('/books') && !pathname.includes('/cart') ? 700 : 500,
              color: pathname?.startsWith('/books') && !pathname.includes('/cart') ? 'var(--color-primary)' : 'var(--color-text-muted)',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <Library size={20} />
            <span>Catalog</span>
          </Link>

          <Link
            href="/cart"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: pathname === '/cart' ? 700 : 500,
              color: pathname === '/cart' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              gap: '4px',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '24%',
                backgroundColor: 'var(--color-error)',
                color: 'white',
                fontSize: '0.62rem',
                fontWeight: 700,
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/contact"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: pathname === '/contact' ? 700 : 500,
              color: pathname === '/contact' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <Phone size={20} />
            <span>Contact</span>
          </Link>
        </div>
      </nav>

      {/* Global CSS to handle visibility and spacing */}
      <style jsx global>{`
        .mobile-only-fab-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 769px) {
          .call-fab-button {
            display: none !important;
          }
          .mobile-only-fab-container {
            bottom: 94px !important;
            right: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .global-mobile-bottom-nav {
            display: block !important;
          }
          body {
            padding-bottom: 64px !important; /* space for sticky bar */
          }
        }
      `}</style>
    </>
  );
}
