'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Sparkles, AlertCircle } from 'lucide-react';

interface PurchaseAlert {
  name: string;
  location: string;
  item: string;
  time: string;
}

const mockPurchases: PurchaseAlert[] = [
  { name: 'Rohan S.', location: 'Bhanwarkuan, Indore', item: 'MPPSC GS Prelims Complete Kit', time: '3 mins ago' },
  { name: 'Aditya P.', location: 'Geeta Bhawan Hostel, Indore', item: 'UPSC Laxmikanth Polity 7th Ed', time: '6 mins ago' },
  { name: 'Sneha M.', location: 'Navlakha Library, Indore', item: 'Classmate registers & Parker Pen', time: '9 mins ago' },
  { name: 'Amit K.', location: 'Vijay Nagar, Indore', item: 'Casio Scientific Calculator', time: '12 mins ago' },
  { name: 'Priya R.', location: 'Bhanwarkuan Student Hub', item: 'Atomic Habits Novel', time: '15 mins ago' }
];

export default function ConversionBoosters() {
  const [currentAlert, setCurrentAlert] = useState<PurchaseAlert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);

  // 1. Live Purchase Notifications loop
  useEffect(() => {
    let alertIndex = 0;
    
    const triggerAlert = () => {
      setCurrentAlert(mockPurchases[alertIndex]);
      setShowAlert(true);
      
      // Hide after 5 seconds
      const hideTimeout = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      // Move to next alert
      alertIndex = (alertIndex + 1) % mockPurchases.length;

      return hideTimeout;
    };

    // Initial alert after 8 seconds
    const initialTimeout = setTimeout(() => {
      triggerAlert();
    }, 8000);

    // Loop every 20 seconds
    const interval = setInterval(() => {
      triggerAlert();
    }, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // 2. Exit Intent detector
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // If cursor leaves viewport from the top edge and has not triggered before
      if (e.clientY < 20 && !exitIntentTriggered) {
        // Check if they already dismissed it in this session
        const dismissed = sessionStorage.getItem('vbs_exit_intent_dismissed');
        if (!dismissed) {
          setShowExitIntent(true);
          setExitIntentTriggered(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitIntentTriggered]);

  const dismissExitIntent = () => {
    setShowExitIntent(false);
    sessionStorage.setItem('vbs_exit_intent_dismissed', 'true');
  };

  return (
    <>
      {/* Live Purchase Notification Alert Toast */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 99999,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid var(--color-primary-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-premium)',
        padding: '14px 18px',
        width: '320px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: showAlert ? 1 : 0,
        transform: showAlert ? 'translateX(0)' : 'translateX(-50px)',
        visibility: showAlert ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), visibility 0.3s',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShoppingBag size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.8rem', margin: 0, fontWeight: 700, color: 'var(--color-primary)' }}>
            Recent Student Purchase!
          </p>
          <p style={{ fontSize: '0.75rem', margin: '2px 0 0 0', color: 'var(--color-text-main)', lineHeight: 1.3 }}>
            <strong>{currentAlert?.name}</strong> from {currentAlert?.location} bought <strong>{currentAlert?.item}</strong>
          </p>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-light)', display: 'block', marginTop: '2px' }}>
            ⚡ {currentAlert?.time}
          </span>
        </div>
        <button 
          onClick={() => setShowAlert(false)} 
          style={{ border: 'none', background: 'transparent', color: 'var(--color-text-light)', cursor: 'pointer', padding: 0 }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Exit Intent Coupon Popup Modal */}
      {showExitIntent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-premium)',
            width: '100%',
            maxWidth: '480px',
            padding: '30px',
            textAlign: 'center',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <button 
              onClick={dismissExitIntent} 
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-light)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#fef9c3',
              color: '#ca8a04',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
              Wait! Don't Go Empty Handed
            </h3>
            
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              Indore's student community loves deals. Sourced directly from Payal Plaza, get an exclusive **10% extra discount** on your first order!
            </p>

            <div style={{
              border: '2px dashed var(--color-primary)',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-light)',
              padding: '14px 20px',
              width: '100%',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              letterSpacing: '1px'
            }}>
              VIDHYA10
            </div>

            <button 
              onClick={dismissExitIntent}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '0.9rem',
                width: '100%',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              Apply Discount & Shop
            </button>
          </div>
        </div>
      )}
    </>
  );
}
