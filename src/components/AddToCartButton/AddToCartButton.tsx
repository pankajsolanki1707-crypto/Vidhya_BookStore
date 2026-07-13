'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/database';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    setQuantity(prev => {
      const max = product.stockCount || 10;
      return prev < max ? prev + 1 : prev;
    });
  };

  const decrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    // Show temporary success feedback
    const btn = document.getElementById('add-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Added to Cart! ✓';
      btn.style.backgroundColor = '#10b981'; // Green success color
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = ''; // Restore default
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      {product.inStock ? (
        <>
          {/* Quantity Selector */}
          <div className={styles.quantityContainer}>
            <button onClick={decrement} className={styles.qtyBtn} aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button onClick={increment} className={styles.qtyBtn} aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            id="add-btn"
            onClick={handleAdd}
            className={styles.addBtn}
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </>
      ) : (
        <span className={styles.outOfStock}>Temporarily Out of Stock</span>
      )}
    </div>
  );
}
