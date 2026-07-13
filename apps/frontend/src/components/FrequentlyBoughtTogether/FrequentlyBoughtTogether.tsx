'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/database';
import { Plus, ShoppingCart } from 'lucide-react';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export default function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const { addToCart } = useCart();
  
  // Set up the companion product based on category
  const companion: Product = currentProduct.category === 'Stationery'
    ? {
        id: 'stationery-parker-vector',
        title: 'Parker Vector Matte Black CT Ball Pen',
        author: 'Parker Pen Co.',
        publisher: 'Luxor Writing Instruments',
        price: 320,
        originalPrice: 400,
        category: 'Stationery',
        subcategory: 'Premium Pens',
        format: 'Stationery',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=60',
        description: 'Matte black pen.',
        rating: 4.4,
        reviewCount: 180,
        inStock: true,
        stockCount: 40,
        isbn: 'N/A',
        pages: 0,
        publishYear: 2025,
        featured: true,
        isBestseller: false,
        isNewArrival: false
      }
    : {
        id: 'stationery-classmate-notebook-pack',
        title: 'Classmate Premium Notebooks (6-Pack, 172 Pages)',
        author: 'ITC Classmate',
        publisher: 'ITC Limited',
        price: 360,
        originalPrice: 420,
        category: 'Stationery',
        subcategory: 'Notebooks',
        format: 'Stationery',
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=60',
        description: 'Notebook pack.',
        rating: 4.6,
        reviewCount: 380,
        inStock: true,
        stockCount: 110,
        isbn: 'N/A',
        pages: 172,
        publishYear: 2026,
        featured: false,
        isBestseller: true,
        isNewArrival: false
      };

  const [checkCurrent, setCheckCurrent] = useState(true);
  const [checkCompanion, setCheckCompanion] = useState(true);

  // Sum up prices
  let totalPrice = 0;
  let selectedCount = 0;

  if (checkCurrent) {
    totalPrice += currentProduct.price;
    selectedCount += 1;
  }
  if (checkCompanion) {
    totalPrice += companion.price;
    selectedCount += 1;
  }

  const handleAddBundle = () => {
    if (checkCurrent) {
      addToCart(currentProduct);
    }
    if (checkCompanion) {
      addToCart(companion);
    }
    alert(`Added ${selectedCount} items to your shopping cart! 🛒`);
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-light)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      marginTop: '40px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '16px' }}>
        Frequently Bought Together
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        {/* Current Product item */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={checkCurrent}
            onChange={(e) => setCheckCurrent(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <img src={currentProduct.image} alt={currentProduct.title} style={{ width: '50px', height: '65px', borderRadius: '4px', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentProduct.title}
            </h4>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)' }}>₹{currentProduct.price}</span>
          </div>
        </div>

        <Plus size={20} style={{ color: 'var(--color-text-light)' }} />

        {/* Companion Product item */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={checkCompanion}
            onChange={(e) => setCheckCompanion(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <img src={companion.image} alt={companion.title} style={{ width: '50px', height: '65px', borderRadius: '4px', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {companion.title}
            </h4>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)' }}>₹{companion.price}</span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Price for Selected:</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{totalPrice}</div>
        </div>
        <button
          onClick={handleAddBundle}
          disabled={selectedCount === 0}
          className="btn-accent"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            opacity: selectedCount === 0 ? 0.6 : 1,
            cursor: selectedCount === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ShoppingCart size={16} />
          <span>Add Bundle to Cart</span>
        </button>
      </div>
    </div>
  );
}
