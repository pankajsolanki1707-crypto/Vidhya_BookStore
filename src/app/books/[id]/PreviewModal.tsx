'use client';

import React, { useState } from 'react';
import { BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PreviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const previewSlides = [
    {
      title: 'Table of Contents & Index Page',
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60',
      desc: 'Detailed breakdown of sections, coaching outlines, and marking distributions.'
    },
    {
      title: 'Sample Practice Test Questions',
      img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60',
      desc: 'Verify the print resolution, layout formatting, and detailed solutions scheme.'
    }
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % previewSlides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + previewSlides.length) % previewSlides.length);
  };

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); setActiveSlide(0); }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '12px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
        className="preview-link"
      >
        <BookOpen size={14} />
        <span>Look Inside / Preview Pages</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '550px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                Look Inside: {previewSlides[activeSlide].title}
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ color: '#ffffff', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Image slide */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
              <div style={{ width: '100%', height: '320px', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--color-border)', position: 'relative' }}>
                <img
                  src={previewSlides[activeSlide].img}
                  alt="Page Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Left arrow */}
                <button
                  onClick={handlePrev}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                {/* Right arrow */}
                <button
                  onClick={handleNext}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>
                {previewSlides[activeSlide].desc}
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', textAlign: 'right', backgroundColor: 'var(--color-bg-light)' }}>
              <span style={{ fontSize: '0.8rem', marginRight: '16px', color: 'var(--color-text-light)' }}>
                Page {activeSlide + 1} of {previewSlides.length}
              </span>
              <button onClick={() => setIsOpen(false)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
