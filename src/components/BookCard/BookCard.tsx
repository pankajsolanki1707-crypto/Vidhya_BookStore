'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/database';
import { Star, ShoppingCart, Tag } from 'lucide-react';
import styles from './BookCard.module.css';

interface BookCardProps {
  product: Product;
}

export default function BookCard({ product }: BookCardProps) {
  const { addToCart } = useCart();
  
  // Calculate discount percentage if original price exists
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={styles.card}>
      {/* Badges Overlay */}
      <div className={styles.badgeContainer}>
        {product.isBestseller && <span className="badge-bestseller">Bestseller</span>}
        {product.isNewArrival && <span className="badge-new">New</span>}
        {discountPercent > 0 && (
          <span className={styles.discountBadge}>-{discountPercent}%</span>
        )}
      </div>

      {/* Book Image */}
      <Link href={`/books/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.title} className={styles.image} loading="lazy" />
        </div>
      </Link>

      {/* Book Content */}
      <div className={styles.content}>
        {/* Category & Format Tag */}
        <div className={styles.metaRow}>
          <span className={styles.formatBadge}>
            <Tag size={10} />
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
