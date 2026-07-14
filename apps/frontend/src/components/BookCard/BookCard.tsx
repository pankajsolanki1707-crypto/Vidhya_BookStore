'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/database';
import { Star, ShoppingCart, Tag, Heart, Eye, GitCompare } from 'lucide-react';
import styles from './BookCard.module.css';

interface BookCardProps {
  product: Product;
}

export default function BookCard({ product }: BookCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  
  // Calculate discount percentage if original price exists
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Load wishlist and compare status on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('vbs_wishlist');
      if (storedWishlist) {
        const items = JSON.parse(storedWishlist) as Product[];
        setIsWishlisted(items.some(item => item.id === product.id));
      }

      const storedCompare = localStorage.getItem('vbs_compare');
      if (storedCompare) {
        const items = JSON.parse(storedCompare) as Product[];
        setIsCompared(items.some(item => item.id === product.id));
      }
    } catch (e) {
      console.error('Error reading storage:', e);
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        setIsWishlisted(false);
      } else {
        updated = [...items, product];
        setIsWishlisted(true);
      }
      localStorage.setItem('vbs_wishlist', JSON.stringify(updated));
    } catch (e) {
      console.error('Error toggling wishlist:', e);
    }
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('vbs_compare');
      let items: Product[] = [];
      if (stored) {
        items = JSON.parse(stored) as Product[];
      }
      const exists = items.some(item => item.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = items.filter(item => item.id !== product.id);
        setIsCompared(false);
      } else {
        if (items.length >= 3) {
          alert('You can compare a maximum of 3 books at a time.');
          return;
        }
        updated = [...items, product];
        setIsCompared(true);
      }
      localStorage.setItem('vbs_compare', JSON.stringify(updated));
      window.dispatchEvent(new Event('vbs_compare_changed'));
    } catch (e) {
      console.error('Error toggling compare:', e);
    }
  };

  // Determine Ribbon tag
  let ribbonText = "";
  let ribbonClass = "";
  if (product.isBestseller) {
    ribbonText = "BESTSELLER";
    ribbonClass = styles.ribbonBestseller;
  } else if (product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5) {
    ribbonText = "LIMITED STOCK";
    ribbonClass = styles.ribbonLimited;
  } else if (product.isNewArrival) {
    ribbonText = "NEW ARRIVAL";
    ribbonClass = styles.ribbonNew;
  } else if (product.featured) {
    ribbonText = "EDITOR PICK";
    ribbonClass = styles.ribbonEditor;
  } else if (product.rating >= 4.7) {
    ribbonText = "TRENDING";
    ribbonClass = styles.ribbonTrending;
  }

  // Stock status text
  const getStockStatus = () => {
    if (!product.inStock) {
      return <span className={styles.stockStatusOut}>Out of Stock</span>;
    }
    if (product.stockCount && product.stockCount <= 5) {
      return <span className={styles.stockStatusLow}>Only {product.stockCount} left!</span>;
    }
    return <span className={styles.stockStatusIn}>In Stock</span>;
  };

  // Dynamic estimated delivery date
  const getExpectedDeliveryDate = () => {
    const today = new Date();
    if (product.category === 'Stationery') {
      return "Same Day Delivery (Indore)";
    }
    // Add 1 day for Indore express
    const delDate = new Date(today);
    delDate.setDate(today.getDate() + 1);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `Get it by tomorrow, ${delDate.toLocaleDateString('en-IN', options)}`;
  };

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div className={styles.card}>
        {/* Ribbons Overlay */}
        {ribbonText && (
          <span className={`${styles.ribbon} ${ribbonClass}`}>
            {ribbonText}
          </span>
        )}

        {/* Floating Wishlist Icon */}
        <button 
          type="button" 
          onClick={toggleWishlist} 
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          aria-label="Toggle Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? 'var(--color-error)' : 'none'} />
        </button>

        {/* Floating Compare Icon */}
        <button 
          type="button" 
          onClick={toggleCompare} 
          className={`${styles.compareBtn} ${isCompared ? styles.compared : ''}`}
          title="Compare specifications"
          aria-label="Toggle Compare"
        >
          <GitCompare size={16} />
        </button>

        {/* Book Image */}
        <Link href={`/books/${product.id}`} className={styles.imageLink}>
          <div className={styles.imageContainer}>
            <img src={product.image} alt={product.title} className={styles.image} loading="lazy" />
            {discountPercent > 0 && (
              <span className={styles.discountBadge}>-{discountPercent}% OFF</span>
            )}
            {/* Quick View Hover State */}
            <div 
              className={styles.quickViewOverlay}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
            >
              <Eye size={18} />
              <span>Quick View</span>
            </div>
          </div>
        </Link>

        {/* Book Content */}
        <div className={styles.content}>
          {/* Category & Format Tag */}
          <div className={styles.metaRow}>
            <span className={styles.formatBadge}>
              <Tag size={10} style={{ marginRight: '4px' }} />
              {product.format}
            </span>
            <span className={styles.categoryName}>{product.category}</span>
          </div>

          {/* Title */}
          <h3 className={styles.title} title={product.title}>
            <Link href={`/books/${product.id}`}>{product.title}</Link>
          </h3>

          {/* Author */}
          <p className={styles.author}>By {product.author}</p>

          {/* Ratings */}
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                />
              ))}
            </div>
            <span className={styles.reviews}>({product.reviewCount})</span>
          </div>

          {/* Stock status indicator */}
          <div className={styles.stockRow}>
            {getStockStatus()}
          </div>

          {/* Estimated Delivery */}
          <div className={styles.deliveryRow}>
            <span className={styles.deliveryEstimate}>
              🚚 {getExpectedDeliveryDate()}
            </span>
          </div>

          {/* Footer: Price & Cart Button */}
          <div className={styles.cardFooter}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>₹{product.price}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>₹{product.originalPrice}</span>
              )}
            </div>

            {product.inStock ? (
              <button
                onClick={() => addToCart(product)}
                className={styles.cartBtn}
                aria-label="Add to Cart"
              >
                <ShoppingCart size={18} />
              </button>
            ) : (
              <span className={styles.outOfStock}>Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal Dialog */}
      {isQuickViewOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px'
        }} onClick={() => setIsQuickViewOpen(false)}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-premium)',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button 
              onClick={() => setIsQuickViewOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
            >
              <X size={20} />
            </button>

            {/* Content Row */}
            <div style={{ display: 'flex', gap: '20px', padding: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-light)', borderRadius: '8px', padding: '16px' }}>
                <img src={product.image} alt={product.title} style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '4px', boxShadow: 'var(--shadow-sm)' }} />
              </div>
              <div style={{ flex: '1 2 260px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                <span className={styles.formatBadge} style={{ alignSelf: 'flex-start' }}>{product.format}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{product.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>By {product.author}</p>
                
                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#FCD116' : 'none'} stroke={i < Math.floor(product.rating) ? '#FCD116' : 'var(--color-text-light)'} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({product.reviewCount} reviews)</span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                  {product.description}
                </p>

                {/* Price block */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                      <span className={styles.discountBadge} style={{ padding: '2px 6px', fontSize: '0.75rem' }}>{discountPercent}% OFF</span>
                    </>
                  )}
                </div>

                {/* Expected Delivery */}
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
                  🚚 {getExpectedDeliveryDate()}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  {product.inStock ? (
                    <button
                      onClick={() => {
                        addToCart(product);
                        setIsQuickViewOpen(false);
                      }}
                      className="btn-primary"
                      style={{ fontSize: '0.8rem', padding: '8px 16px', flex: 1, justifyContent: 'center' }}
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                  ) : (
                    <span style={{ color: 'var(--color-error)', fontWeight: 700, fontSize: '0.85rem' }}>Out of Stock</span>
                  )}
                  <Link 
                    href={`/books/${product.id}`} 
                    className="btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '8px 16px', justifyContent: 'center' }}
                    onClick={() => setIsQuickViewOpen(false)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
