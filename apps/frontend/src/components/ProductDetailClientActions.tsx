'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, ShieldCheck, HelpCircle, FileText, CheckCircle, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  title: string;
  author: string;
  publisher: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isbn: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
}

// --------------------------------------------------
// 1. IMAGE ZOOM COMPONENT
// --------------------------------------------------
export function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    backgroundImage: `url(${src})`,
    backgroundPosition: '0% 0%',
    backgroundSize: '100% 100%'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '240%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: '0% 0%',
      backgroundSize: '100% 100%'
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '240px',
        height: '330px',
        borderRadius: 'var(--radius-sm)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: zoomStyle.backgroundPosition,
        backgroundImage: zoomStyle.backgroundImage,
        backgroundSize: zoomStyle.backgroundSize,
        cursor: 'zoom-in',
        boxShadow: '0 15px 30px -5px rgba(33, 61, 143, 0.25)',
        transition: 'background-size 0.2s ease, background-position 0.05s ease',
        backgroundColor: 'white'
      }}
      aria-label={alt}
    />
  );
}

// --------------------------------------------------
// 2. URGENCY & DELIVERY DATE COUNTDOWN
// --------------------------------------------------
export function UrgencyNotifier({ category }: { category: string }) {
  const [views, setViews] = useState(12);
  const [hour, setHour] = useState(0);

  useEffect(() => {
    setViews(Math.floor(Math.random() * 15) + 8);
    setHour(new Date().getHours());
  }, []);

  const deliveryText = category === 'Stationery'
    ? '⚡ Same-Day Delivery available in Indore! Order within the next 3 hours.'
    : hour < 16
      ? '🚚 Same-Day Delivery: Order within the next 4 hours to receive it by 9 PM tonight in Indore!'
      : '🚚 Next-Day Delivery: Order now to receive it by tomorrow morning at your hostel/library desk!';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.85rem',
        color: '#b45309',
        backgroundColor: '#fffbeb',
        border: '1px solid #fef3c7',
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600
      }}>
        <span>🔥 {views} students viewed this book in the last hour!</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.82rem',
        color: '#047857',
        backgroundColor: '#ecfdf5',
        border: '1px solid #d1fae5',
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600
      }}>
        <span>{deliveryText}</span>
      </div>
    </div>
  );
}

// --------------------------------------------------
// 3. SPECIFICATION TABS
// --------------------------------------------------
export function SpecsTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'who' | 'syllabus'>('overview');

  const highlights = [
    '100% genuine printed copy sourced directly from authorized publications.',
    'Comprehensive syllabus coverage with topic-wise explanation chapters.',
    'Includes previous years solved question papers and model mock tests.',
    'High-quality binding and white paper format optimized for revision notes.'
  ];

  const whoShouldRead = product.category === 'Competitive Exams'
    ? 'Designed specifically for MPPSC/UPSC civil services aspirants, state board candidates, and coaching students seeking highly structured offline guide books.'
    : product.category === 'Academic Textbooks'
      ? 'Perfect for DAVV university college students preparing for semester exams, engineering/medical course works, and professional entry exams.'
      : 'Suitable for literature enthusiasts, fiction readers, and students seeking self-improvement or leisure reading material.';

  const syllabusHighlights = product.category === 'Competitive Exams'
    ? 'Covers Indian Polity structure, State geography mapping notes, history timeline charts, and GK current affairs summaries revised for 2026.'
    : 'Aligned with DAVV Indore semester guidelines, including chapter-end review equations, solved class notes, and previous year board papers.';

  return (
    <div style={{ marginTop: '30px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
      <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', marginBottom: '20px' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'who', label: 'Who Should Read' },
          { id: 'syllabus', label: 'Syllabus Highlights' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-light)',
              borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '120px' }}>
        {activeTab === 'overview' && (
          <div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)', marginBottom: '14px' }}>
              {product.description}
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', paddingLeft: 0 }}>
              {highlights.map((hl, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '3px' }} />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'who' && (
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            {whoShouldRead}
          </p>
        )}

        {activeTab === 'syllabus' && (
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            {syllabusHighlights}
          </p>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------
// 4. STICKY BOTTOM PURCHASE BAR
// --------------------------------------------------
export function StickyPurchaseBar({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1.5px solid var(--color-primary-medium)',
      boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
      padding: '12px 24px',
      zIndex: 9998,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      animation: 'slideUp 0.25s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', overflow: 'hidden' }}>
        <img src={product.image} alt={product.title} style={{ width: '32px', height: '44px', borderRadius: '4px', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textHighlight: 'ellipsis', textOverflow: 'ellipsis', maxWidth: '300px' }}>
            {product.title}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>By {product.author}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)' }}>₹{product.price}</span>
        {product.inStock ? (
          <button
            onClick={() => addToCart(product as any)}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 24px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ShoppingCart size={15} /> Add to Cart
          </button>
        ) : (
          <span style={{ color: 'var(--color-error)', fontWeight: 700, fontSize: '0.85rem' }}>Out of Stock</span>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------
// 5. EXPRESS CHECKOUT BUTTON
// --------------------------------------------------
export function ExpressBuyButton({ product }: { product: Product }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vbs_user_token');
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, []);

  const handleExpressBuy = async () => {
    setLoading(true);
    // Simulate placing order instantly
    setTimeout(() => {
      setLoading(false);
      alert(`⚡ Express Order Placed Successfully!\n\nProduct: "${product.title}"\nPayment Method: Pay on Delivery (COD)\nDelivery Address: Default Registered Student Hostel Address\n\nThank you for choosing Vidhya Express Checkout! ✓`);
      window.location.href = `/account`;
    }, 1500);
  };

  if (!isUserLoggedIn) {
    return (
      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '8px', fontStyle: 'italic' }}>
        🔑 <Link href="/auth" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 600 }}>Login</Link> to unlock 1-Click Express Checkout!
      </div>
    );
  }

  return (
    <button
      onClick={handleExpressBuy}
      disabled={loading}
      style={{
        backgroundColor: '#b45309',
        color: '#ffffff',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 20px',
        fontSize: '0.85rem',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        width: '100%',
        boxShadow: 'var(--shadow-sm)',
        marginTop: '10px',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#92400e'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b45309'}
    >
      {loading ? 'Processing...' : '⚡ 1-Click Express Purchase'}
    </button>
  );
}

// --------------------------------------------------
// 6. BACK IN STOCK NOTIFIER
// --------------------------------------------------
export function RestockNotifierForm({ product }: { product: Product }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    alert(`✓ Restock Notification Registered!\nWe will notify you at ${email} as soon as "${product.title}" is back in stock at Payal Plaza.`);
  };

  return (
    <div style={{
      border: '1.5px dashed var(--color-border)',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: 'var(--color-bg-light)',
      marginTop: '10px'
    }}>
      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-error)', margin: '0 0 6px 0' }}>
        🚫 Out of Stock
      </h4>
      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
        This guidebook is currently out of stock. Leave your email below to receive an instant alert when it arrives.
      </p>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="email" 
            placeholder="student@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1,
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '0.8rem',
              backgroundColor: '#ffffff'
            }}
          />
          <button 
            type="submit"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Notify Me
          </button>
        </form>
      ) : (
        <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700 }}>
          ✓ Restock alert active for: {email}
        </div>
      )}
    </div>
  );
}

