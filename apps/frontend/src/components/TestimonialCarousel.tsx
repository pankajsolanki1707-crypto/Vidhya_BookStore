'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle, MessageSquare } from 'lucide-react';

interface Testimonial {
  name: string;
  meta: string;
  initial: string;
  rating: number;
  text: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const active = testimonials[activeIndex];

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      backgroundColor: '#ffffff',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-premium)',
      borderRadius: 'var(--radius-lg)',
      padding: '40px 60px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      alignItems: 'center',
      textAlign: 'center',
      minHeight: '280px'
    }}>
      {/* Quotation Icon and Rating */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)'
        }}>
          <MessageSquare size={24} />
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          {[...Array(active.rating)].map((_, i) => (
            <Star key={i} size={18} fill="#FCD116" stroke="none" />
          ))}
        </div>
      </div>

      {/* Review Text */}
      <p style={{
        fontSize: '1.05rem',
        lineHeight: 1.7,
        color: 'var(--color-text-main)',
        fontWeight: 500,
        fontStyle: 'italic',
        margin: 0
      }}>
        "{active.text}"
      </p>

      {/* Reviewer Details */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '16px',
        width: '100%',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1rem'
        }}>
          {active.initial}
        </div>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {active.name}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.65rem',
              color: '#047857',
              backgroundColor: '#ecfdf5',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              <CheckCircle size={10} /> Verified Student
            </span>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>{active.meta}</span>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        aria-label="Previous Review"
      >
        <ChevronLeft size={20} style={{ color: 'var(--color-primary)' }} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        aria-label="Next Review"
      >
        <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
      </button>

      {/* Dot Indicators */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: i === activeIndex ? 'var(--color-primary)' : 'var(--color-border)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
