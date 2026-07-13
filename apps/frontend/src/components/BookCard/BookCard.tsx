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
      return <span className={styles.stockStatusLow}>Only {product.stockCount} left in stock!</span>;
    }
    return <span className={styles.stockStatusIn}>In Stock</span>;
  };

  return (
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
          <div className={styles.quickViewOverlay}>
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
            🚚 Delivery: {product.category === 'Stationery' ? 'Same Day (Indore)' : '1-2 Days'}
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
  );
}
