'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/database';

interface WishlistToggleProps {
  product: Product;
}

export default function WishlistToggle({ product }: WishlistToggleProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vbs_wishlist');
      if (stored) {
        const items = JSON.parse(stored) as Product[];
        setIsSaved(items.some(item => item.id === product.id));
      }
    } catch (e) {
      console.error('Error reading wishlist:', e);
    }
  }, [product.id]);

  const handleToggle = () => {
    try {
      const stored = localStorage.getItem('vbs_wishlist');
      let items: Product[] = [];
      if (stored) {
        items = JSON.parse(stored) as Product[];
      }

      const exists = items.some(item => item.id === product.id);
      let updated: Product[];

      if (exists) {
        updated = items.filter(item => item.id !== product.id);
        setIsSaved(false);
        alert('Removed from wishlist! 🤍');
      } else {
        updated = [...items, product];
        setIsSaved(true);
        alert('Added to wishlist! ❤️');
      }

      localStorage.setItem('vbs_wishlist', JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating wishlist:', e);
    }
  };

  return (
    <button
      onClick={handleToggle}
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
        color: isSaved ? 'var(--color-error)' : 'var(--color-text-main)',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
        minWidth: '150px'
      }}
      className="wishlist-btn"
    >
      <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
      <span>{isSaved ? 'Wishlisted' : 'Add to Wishlist'}</span>
    </button>
  );
}
