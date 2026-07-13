'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BookCard from '@/components/BookCard/BookCard';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/database';
import { Heart, Trash2, ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import styles from '../user.module.css';

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vbs_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored) as Product[]);
      }
    } catch (e) {
      console.error('Error loading wishlist:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save changes
  const saveWishlist = (items: Product[]) => {
    setWishlist(items);
    try {
      localStorage.setItem('vbs_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  };

  const handleRemove = (productId: string) => {
    const updated = wishlist.filter(p => p.id !== productId);
    saveWishlist(updated);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Remove from wishlist
    handleRemove(product.id);
  };

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Your Wishlist</h1>
            <p className={styles.pageSubtitle}>Saved books and stationery materials you plan to buy later</p>
          </div>

          {isLoaded && wishlist.length > 0 ? (
            <div className={styles.wishlistGrid}>
              {wishlist.map((product) => (
                <div key={product.id} style={{ position: 'relative' }}>
                  <BookCard product={product} />
                  {/* Absolute remove button over the card for clean UX */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#ffffff',
                      color: 'var(--color-error)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)',
                      zIndex: 20
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--color-bg-light)', border: '1px dashed var(--color-border)', borderRadius: '12px', maxWidth: '500px', margin: '40px auto' }}>
              <Heart size={48} style={{ color: 'var(--color-primary)', opacity: 0.8, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '8px' }}>Your wishlist is empty</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                You haven't saved any books or exam guides to your wishlist. Save books while browsing the store by clicking the heart options.
              </p>
              <Link href="/books" className="btn-primary">
                Browse Books Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
