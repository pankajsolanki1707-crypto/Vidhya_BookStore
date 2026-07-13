'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShoppingBag } from 'lucide-react';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();

  // Shipping calculation rules: free above Rs 499, otherwise Rs 49 in Indore
  const shippingCharge = cartTotal >= 499 ? 0 : 49;
  const grandTotal = cartTotal + shippingCharge;

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.cartSection}>
        <div className="container">
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ArrowRight size={12} style={{ margin: '0 8px' }} />
            <span className={styles.breadcrumbCurrent}>Shopping Cart</span>
          </div>

          <h1 className={styles.pageTitle}>Your Shopping Cart</h1>

          <div className={styles.cartGrid}>
            {cart.length > 0 ? (
              <>
                {/* Left panel: Items list */}
                <div className={styles.itemsContainer}>
                  <div className={styles.cartHeader}>
                    <span>Product Details</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span>Subtotal</span>
                    <span>Remove</span>
                  </div>

                  {cart.map((item) => (
                    <div key={item.product.id} className={styles.cartItem}>
                      {/* Thumbnail & Title */}
                      <div className={styles.itemInfo}>
                        <img src={item.product.image} alt={item.product.title} className={styles.itemImage} />
                        <div>
                          <Link href={`/books/${item.product.id}`} className={styles.itemTitle}>
                            {item.product.title}
                          </Link>
                          <p className={styles.itemAuthor}>By {item.product.author}</p>
                          <p className={styles.itemAuthor} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                            Format: {item.product.format}
                          </p>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className={styles.itemPrice}>
                        <span>₹{item.product.price}</span>
                      </div>

                      {/* Quantity Controller */}
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className={styles.qtyBtn}
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyVal}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className={styles.qtyBtn}
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className={styles.itemSubtotal}>
                        <span>₹{item.product.price * item.quantity}</span>
                      </div>

                      {/* Remove Button */}
                      <div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className={styles.removeBtn}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right panel: Summary card */}
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryTitle}>Order Summary</h3>

                  <div className={styles.summaryRows}>
                    <div className={styles.summaryRow}>
                      <span>Items Count</span>
                      <span>{cartCount} items</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Subtotal Price</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Local Shipping (Indore)</span>
                      <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                    </div>

                    {shippingCharge > 0 && (
                      <div className={styles.freeDeliveryAlert}>
                        💡 Add <strong>₹{499 - cartTotal}</strong> more to qualify for <strong>FREE Delivery</strong>!
                      </div>
                    )}

                    <div className={styles.summaryRowStrong}>
                      <span>Total Amount</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className={styles.checkoutBtn}>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </Link>

                  <Link href="/books" className={styles.continueShoppingLink}>
                    Continue Shopping
                  </Link>
                </div>
              </>
            ) : (
              <div className={styles.emptyCart}>
                <ShoppingBag size={48} style={{ color: 'var(--color-primary)', opacity: 0.8 }} />
                <h3 className={styles.emptyCartTitle}>Your cart is empty</h3>
                <p className={styles.emptyCartText}>
                  Looks like you haven't added any exam guides, text books, or stationery packages yet. Browse our collections to find what you need.
                </p>
                <Link href="/books" className="btn-primary" style={{ marginTop: '10px' }}>
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
