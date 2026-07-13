'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/database';
import BookCard from '@/components/BookCard/BookCard';

interface RecentlyViewedProps {
  currentProductId: string;
  allProducts: Product[];
}

export default function RecentlyViewed({ currentProductId, allProducts }: RecentlyViewedProps) {
  const [recentItems, setRecentItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vbs_recently_viewed');
      let viewedIds: string[] = stored ? JSON.parse(stored) : [];

      // Remove current id if it exists, then add to front
      viewedIds = viewedIds.filter(id => id !== currentProductId);
      viewedIds.unshift(currentProductId);

      // Keep only last 5 items
      const truncated = viewedIds.slice(0, 5);
      localStorage.setItem('vbs_recently_viewed', JSON.stringify(truncated));

      // Load products matching these ids (excluding current product from display)
      const displayIds = truncated.filter(id => id !== currentProductId).slice(0, 4);
      const matched = displayIds
        .map(id => allProducts.find(p => p.id === id))
        .filter((p): p is Product => !!p);

      setRecentItems(matched);
    } catch (e) {
      console.error('Error handling recently viewed:', e);
    }
  }, [currentProductId, allProducts]);

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '50px', borderTop: '1px solid var(--color-border)', paddingTop: '40px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '24px' }}>
        Recently Viewed Items
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        {recentItems.map((product) => (
          <BookCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
