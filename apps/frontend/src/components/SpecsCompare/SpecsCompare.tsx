'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/database';
import { GitCompare, X } from 'lucide-react';

interface SpecsCompareProps {
  currentProduct: Product;
  companionProduct: Product | undefined;
}

export default function SpecsCompare({ currentProduct, companionProduct }: SpecsCompareProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!companionProduct) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          fontWeight: 700,
          backgroundColor: '#ffffff',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          transition: 'var(--transition-smooth)',
          minWidth: '150px'
        }}
        className="compare-btn"
      >
        <GitCompare size={18} />
        <span>Compare Specs</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
            maxWidth: '650px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Compare Book Specifications
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ color: '#ffffff', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '10px', color: 'var(--color-text-muted)', width: '30%' }}>Spec Card</th>
                    <th style={{ padding: '10px', color: 'var(--color-primary)', fontWeight: 700, width: '35%' }}>{currentProduct.title}</th>
                    <th style={{ padding: '10px', color: 'var(--color-primary)', fontWeight: 700, width: '35%' }}>{companionProduct.title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>Selling Price</td>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--color-primary)' }}>₹{currentProduct.price}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--color-primary)' }}>₹{companionProduct.price}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>Format / Binding</td>
                    <td style={{ padding: '12px 10px' }}>{currentProduct.format}</td>
                    <td style={{ padding: '12px 10px' }}>{companionProduct.format}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>Page Count</td>
                    <td style={{ padding: '12px 10px' }}>{currentProduct.pages || 'N/A'} Pages</td>
                    <td style={{ padding: '12px 10px' }}>{companionProduct.pages || 'N/A'} Pages</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>Publisher</td>
                    <td style={{ padding: '12px 10px' }}>{currentProduct.publisher}</td>
                    <td style={{ padding: '12px 10px' }}>{companionProduct.publisher}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>Category</td>
                    <td style={{ padding: '12px 10px' }}>{currentProduct.category}</td>
                    <td style={{ padding: '12px 10px' }}>{companionProduct.category}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>Rating</td>
                    <td style={{ padding: '12px 10px' }}>{currentProduct.rating} ★ ({currentProduct.reviewCount})</td>
                    <td style={{ padding: '12px 10px' }}>{companionProduct.rating} ★ ({companionProduct.reviewCount})</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', textAlign: 'right', backgroundColor: 'var(--color-bg-light)' }}>
              <button onClick={() => setIsOpen(false)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 20px' }}>
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
