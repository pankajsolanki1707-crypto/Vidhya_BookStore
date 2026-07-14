'use client';
import Link from 'next/link';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, ShieldCheck, HelpCircle, FileText, CheckCircle, X, Zap, Plus, Minus } from 'lucide-react';
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
// 1. IMAGE ZOOM & GALLERY COMPONENT
// --------------------------------------------------
export function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [activeImage, setActiveImage] = useState(src);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    backgroundImage: `url(${src})`,
    backgroundPosition: '0% 0%',
    backgroundSize: '100% 100%'
  });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages = [
    src,
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    '/images/shop_interior.jpg'
  ];

  useEffect(() => {
    setActiveImage(src);
    setZoomStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: '0% 0%',
      backgroundSize: '100% 100%'
    });
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '240%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: '0% 0%',
      backgroundSize: '100% 100%'
    });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextSlide = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
      {/* Zoom view area */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => openLightbox(galleryImages.indexOf(activeImage))}
        style={{
          width: '280px',
          height: '380px',
          borderRadius: 'var(--radius-md)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: zoomStyle.backgroundPosition,
          backgroundImage: `url(${activeImage})`,
          backgroundSize: zoomStyle.backgroundSize,
          cursor: 'zoom-in',
          boxShadow: 'var(--shadow-lg)',
          transition: 'background-size 0.2s ease, background-position 0.05s ease',
          backgroundColor: 'white',
          border: '1px solid var(--color-border)'
        }}
        aria-label={alt}
      />
      
      {/* Info indicator */}
      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        🔎 Hover to zoom | Click to view fullscreen
      </span>

      {/* Thumbnails list */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {galleryImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveImage(img);
              setZoomStyle(prev => ({ ...prev, backgroundImage: `url(${img})` }));
            }}
            style={{
              width: '56px',
              height: '70px',
              border: activeImage === img ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              padding: 0,
              cursor: 'pointer',
              backgroundColor: 'white',
              opacity: activeImage === img ? 1 : 0.7,
              transition: 'all 0.2s'
            }}
          >
            <img src={img} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>

      {/* Full screen lightbox overlay */}
      {isLightboxOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <X size={24} />
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '20px',
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>&larr;</span>
          </button>

          {/* Large Image container */}
          <div style={{ maxWidth: '80%', maxHeight: '75vh', overflow: 'hidden' }}>
            <img
              src={galleryImages[lightboxIndex]}
              alt={alt}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '20px',
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>&rarr;</span>
          </button>

          {/* Slide Indicator */}
          <span style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '20px', fontWeight: 600 }}>
            Image {lightboxIndex + 1} of {galleryImages.length}
          </span>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// 1.5 PINCODE CHECKER COMPONENT
// --------------------------------------------------
export function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'indore' | 'postal' | 'error'>('idle');
  const [pickupSelected, setPickupSelected] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setStatus('error');
      return;
    }
    if (pincode.startsWith('452')) {
      setStatus('indore');
    } else {
      setStatus('postal');
    }
  };

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      backgroundColor: '#ffffff',
      marginTop: '20px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setPickupSelected(false)}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: !pickupSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
            color: !pickupSelected ? 'var(--color-primary)' : 'var(--color-text-muted)',
            backgroundColor: !pickupSelected ? 'var(--color-primary-light)' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🚚 Runner Delivery
        </button>
        <button
          type="button"
          onClick={() => setPickupSelected(true)}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: pickupSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
            color: pickupSelected ? 'var(--color-primary)' : 'var(--color-text-muted)',
            backgroundColor: pickupSelected ? 'var(--color-primary-light)' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🏪 Store Pickup
        </button>
      </div>

      {!pickupSelected ? (
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>
            Check Delivery Estimated Time
          </h4>
          <form onSubmit={handleCheck} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit Pincode..."
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '10px 14px',
                fontSize: '0.8rem',
                backgroundColor: 'var(--color-bg-light)'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                padding: '10px 20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Verify
            </button>
          </form>

          <div style={{ marginTop: '12px' }}>
            {status === 'indore' && (
              <div style={{ color: '#047857', backgroundColor: '#ecfdf5', padding: '10px 14px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                ⚡ <strong>Same-Day Hostel Delivery!</strong> Orders to Bhanwarkuan, Geeta Bhawan, or Navlakha hostels placed before 4:00 PM are delivered tonight. Free on orders above ₹499.
              </div>
            )}
            {status === 'postal' && (
              <div style={{ color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '10px 14px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                📦 <strong>Express Shipping:</strong> Dispatched in 24 hours. Reaches you in 2-4 business days via Speed Post / Registered Mail with tracking code.
              </div>
            )}
            {status === 'error' && (
              <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                ❌ Please enter a valid 6-digit Indian pincode (e.g., 452001).
              </div>
            )}
            {status === 'idle' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Same-Day Delivery in Indore hostels & coaching hubs.
              </span>
            )}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
          <div style={{ color: '#047857', backgroundColor: '#ecfdf5', padding: '12px 14px', borderRadius: '4px', fontWeight: 600, marginBottom: '8px' }}>
            🏪 <strong>Instant Store Pickup (Free)</strong>
          </div>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Collect this item directly from our storefront counter at <strong>B-6, Payal Plaza, Bhanwarkuan, Indore</strong> (Below Kautilya Academy).
          </p>
          <p style={{ marginTop: '4px', fontWeight: 700, color: 'var(--color-primary)' }}>
            ⏱️ Ready for collection in 30 minutes!
          </p>
        </div>
      )}

      {/* Return policy note */}
      <div style={{
        marginTop: '16px',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '12px',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <span>🛡️ <strong>7-Day Returns:</strong> Exchange or return books at our store desk or via mail.</span>
        <span>💵 <strong>Secure Payments:</strong> Pay securely using UPI, Credit/Debit cards, Netbanking, or Cash on Delivery.</span>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
        {['Visa', 'Mastercard', 'RuPay', 'UPI', 'COD'].map(p => (
          <span key={p} style={{ fontSize: '0.65rem', padding: '3px 8px', border: '1px solid var(--color-border)', borderRadius: '4px', fontWeight: 700, color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-light)' }}>
            {p}
          </span>
        ))}
      </div>
    </div>
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
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states loaded from localStorage if present
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('452001');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [paymentReference, setPaymentReference] = useState('');
  const [formError, setFormError] = useState('');

  // Load preferences from local storage on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCustomerName(localStorage.getItem('vbs_pref_name') || '');
      setPhone(localStorage.getItem('vbs_pref_phone') || '');
      setTelegram(localStorage.getItem('vbs_pref_telegram') || '');
      setAddress(localStorage.getItem('vbs_pref_address') || 'Bhanwarkuan Hostels, Indore');
    }
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!customerName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setFormError('Please fill in all required shipping fields.');
      return;
    }

    if (paymentMethod === 'UPI' && !paymentReference.trim()) {
      setFormError('Please enter the 12-digit UPI transaction reference ID.');
      return;
    }

    if (quantity > product.stockCount) {
      setFormError(`Insufficient stock. Only ${product.stockCount} copies available.`);
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        telegram: telegram.trim(),
        address: address.trim(),
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: pincode.trim(),
        items: [{
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: quantity,
          image: product.image
        }],
        totalAmount: product.price * quantity,
        paymentMethod,
        paymentReference: paymentMethod === 'UPI' ? paymentReference.trim() : `COD-EXP-${Date.now().toString().slice(-4)}`
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Save preferences to local storage for subsequent orders
        localStorage.setItem('vbs_pref_name', customerName.trim());
        localStorage.setItem('vbs_pref_phone', phone.trim());
        localStorage.setItem('vbs_pref_telegram', telegram.trim());
        localStorage.setItem('vbs_pref_address', address.trim());
        
        alert(`⚡ Order Placed Successfully via Flash Checkout!\n\nOrder ID: ${data.order?.id}\nProduct: "${product.title}" x ${quantity}\nTotal Amount: ₹${product.price * quantity}\nStatus: Pending confirmation\n\nYour order has been recorded. Same-day counter dispatch active in Indore! ✓`);
        setIsOpen(false);
      } else {
        setFormError(data.error || 'Failed to place flash order.');
      }
    } catch {
      setFormError('Network error occurred. Please try standard checkout from Cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!product.inStock || product.stockCount <= 0) {
            alert('This item is currently out of stock.');
            return;
          }
          setIsOpen(true);
        }}
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
        <Zap size={14} /> ⚡ 1-Click Flash Checkout
      </button>

      {/* Flash Checkout Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={18} style={{ color: 'var(--color-accent-yellow)' }} /> 1-Click Flash Checkout
              </h3>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Summary */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', backgroundColor: 'var(--color-bg-light)', borderRadius: '6px' }}>
              <img src={product.image} alt={product.title} style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--color-text-main)' }}>{product.title}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>₹{product.price} each</span>
              </div>
              
              {/* Quantity Counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }}
                >
                  <Minus size={10} style={{ margin: 'auto' }} />
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '16px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => setQuantity(q => Math.min(product.stockCount, q + 1))}
                  style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }}
                >
                  <Plus size={10} style={{ margin: 'auto' }} />
                </button>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Your Name *</label>
                <input 
                  type="text" 
                  required 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="e.g. Rahul Sharma" 
                  style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>WhatsApp/Call Phone *</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="10-digit number" 
                    style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Telegram User (Optional)</label>
                  <input 
                    type="text" 
                    value={telegram} 
                    onChange={(e) => setTelegram(e.target.value)} 
                    placeholder="e.g. rahul_vbs" 
                    style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Indore Delivery Address (Hostel/PG/Flat) *</label>
                <input 
                  type="text" 
                  required 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="e.g. Room 102, Shiv Kripa Hostel, Bhanwarkuan" 
                  style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>City</label>
                  <input type="text" disabled value="Indore" style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-light)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Pincode *</label>
                  <input 
                    type="text" 
                    required 
                    value={pincode} 
                    onChange={(e) => setPincode(e.target.value)} 
                    placeholder="452001" 
                    style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Payment Method:</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} name="flash_payment" />
                    <span>Pay on Delivery (COD)</span>
                  </label>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} name="flash_payment" />
                    <span>Scan & Pay (UPI)</span>
                  </label>
                </div>

                {paymentMethod === 'UPI' && (
                  <div style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#fffbeb', marginTop: '6px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>Scan QR with GPay / PhonePe / Paytm</span>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=9752809717@okbizaxis%26pn=Vidhya%20Book%20Store%26am=${product.price * quantity}%26cu=INR`} 
                      alt="UPI QR Code" 
                      style={{ width: '110px', height: '110px', objectFit: 'contain' }} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', textAlign: 'left' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700 }}>12-Digit UPI Transaction ID *</label>
                      <input 
                        type="text" 
                        required 
                        value={paymentReference} 
                        onChange={(e) => setPaymentReference(e.target.value)} 
                        placeholder="e.g. 304899127845" 
                        style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'white' }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {formError && <div style={{ color: 'var(--color-error)', fontSize: '0.78rem', fontWeight: 600 }}>⚠️ {formError}</div>}

              {/* Total amount summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderTop: '1px solid var(--color-border)', marginTop: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Payable Amount:</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>₹{product.price * quantity}</strong>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  backgroundColor: '#b45309', 
                  color: 'white', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: 'none', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {loading ? 'Submitting Order...' : '⚡ Place Instant Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
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

