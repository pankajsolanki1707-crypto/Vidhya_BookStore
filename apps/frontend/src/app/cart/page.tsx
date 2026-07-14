'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Gift, Sparkles, ShieldCheck, Tag, CheckCircle } from 'lucide-react';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Gift wrap state
  const [giftWrap, setGiftWrap] = useState(false);

  // Order notes state
  const [orderNotes, setOrderNotes] = useState('');


  // Cross-sell products list (stationary / self-help books)
  const [crossSells, setCrossSells] = useState<any[]>([]);

  useEffect(() => {
    const fetchCrossSells = async () => {
      try {
        const res = await fetch('/api/products?limit=12');
        if (res.ok) {
          const data = await res.json();
          const all = data.products || [];
          const stationery = all.filter((p: any) => p.category === 'Stationery' && p.inStock).slice(0, 2);
          setCrossSells(stationery);
        }
      } catch (err) {
        console.error('Error fetching cross-sells:', err);
      }
    };
    fetchCrossSells();
  }, []);


  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'VIDHYA10') {
      setCouponDiscount(Math.round(cartTotal * 0.1));
      setCouponApplied(true);
    } else if (code === 'WELCOME50') {
      setCouponDiscount(50);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid Coupon Code.');
    }
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(false);
  };

  // Shipping calculation rules: flat ₹49 fee on orders below ₹499
  const freeThreshold = 499;
  const shippingCharge = cartTotal >= freeThreshold ? 0 : 49;

  const giftWrapCharge = giftWrap ? 30 : 0;
  const grandTotal = Math.max(0, cartTotal - couponDiscount + shippingCharge + giftWrapCharge);

  // Free shipping progress calculation
  const freeDeliveryProgress = Math.min(100, (cartTotal / freeThreshold) * 100);
  const neededAmount = freeThreshold - cartTotal;

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

                  {/* Add-on Cross-sells block */}
                  {crossSells.length > 0 && (
                    <div style={{ marginTop: '24px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', backgroundColor: 'var(--color-bg-light)' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} className="text-amber-500" /> Frequently Bought With these Books
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {crossSells.map((p) => (
                          <div key={p.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '12px', borderRadius: '8px' }}>
                            <img src={p.image} alt={p.title} style={{ width: '40px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{p.title}</h5>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'block', marginTop: '4px' }}>₹{p.price}</span>
                            </div>
                            <button
                              onClick={() => {
                                // Add to cart
                                const { addToCart: add } = useCart();
                                add(p);
                              }}
                              className="btn-accent"
                              style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                            >
                              Add Addon
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right panel: Summary card */}
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryTitle}>Order Summary</h3>

                  {/* Free Delivery progress bar */}
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Free Delivery Progress</span>
                      <span>{cartTotal >= freeThreshold ? 'FREE Shipping Unlocked! 🎉' : `₹${cartTotal} / ₹${freeThreshold}`}</span>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-border)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: `${freeDeliveryProgress}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.3s ease' }}></div>
                    </div>
                    {neededAmount > 0 && (
                      <div className={styles.freeDeliveryAlert}>
                        💡 Add <strong>₹{neededAmount}</strong> more to qualify for <strong>FREE Delivery</strong>!
                      </div>
                    )}
                  </div>

                  <div className={styles.summaryRows}>
                    <div className={styles.summaryRow}>
                      <span>Items Count</span>
                      <span>{cartCount} items</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Subtotal Price</span>
                      <span>₹{cartTotal}</span>
                    </div>

                    {/* Shipping Zone Selector */}
                    <div className={styles.summaryRow}>
                      <span>Shipping Region</span>
                      <span style={{ fontWeight: 600 }}>Standard Local Delivery</span>
                    </div>

                    <div className={styles.summaryRow}>
                      <span>Logistics courier fee</span>
                      <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                    </div>

                    {/* Gift wrap checkbox */}
                    <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '12px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={giftWrap} 
                          onChange={(e) => setGiftWrap(e.target.checked)} 
                          style={{ accentColor: 'var(--color-primary)' }} 
                        />
                        <Gift size={14} className="text-primary" /> Add Premium Gift Wrapping (+₹30)
                      </label>
                    </div>

                    {/* Order Notes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-light)' }}>Order Notes / Special instructions</label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="e.g. Leave with security guard / Deliver by afternoon"
                        style={{ border: '1px solid var(--color-border)', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', resize: 'vertical', minHeight: '60px', width: '100%', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    {/* Coupon Box */}
                    <div style={{ marginTop: '10px', border: '1px dashed var(--color-primary-medium)', padding: '12px', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-light)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                        <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', color: '#eab308' }} /> Apply coupon
                      </span>
                      {!couponApplied ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            placeholder="e.g. VIDHYA10 or WELCOME50" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            style={{ flex: 1, border: '1px solid var(--color-border)', padding: '6px 10px', fontSize: '0.8rem', borderRadius: '4px' }}
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Apply
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          <span>✓ Coupon applied (-₹{couponDiscount}!)</span>
                          <button onClick={handleRemoveCoupon} style={{ color: 'var(--color-error)', textDecoration: 'underline', border: 'none', background: 'transparent', cursor: 'pointer' }}>Remove</button>
                        </div>
                      )}
                      {couponError && <p style={{ fontSize: '0.72rem', color: 'var(--color-error)', marginTop: '4px', fontWeight: 600 }}>{couponError}</p>}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '0.7rem', color: 'var(--color-text-light)' }}>
                        <span>Quick coupons:</span>
                        <button onClick={() => { setCouponCode('VIDHYA10'); setCouponError(''); }} style={{ color: 'var(--color-primary)', textDecoration: 'underline', border: 'none', background: 'transparent', cursor: 'pointer' }}>VIDHYA10 (10% off)</button>
                        <button onClick={() => { setCouponCode('WELCOME50'); setCouponError(''); }} style={{ color: 'var(--color-primary)', textDecoration: 'underline', border: 'none', background: 'transparent', cursor: 'pointer' }}>WELCOME50 (₹50 off)</button>
                      </div>
                    </div>

                    {couponApplied && (
                      <div className={styles.summaryRow} style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                        <span>Coupon Discount</span>
                        <span>-₹{couponDiscount}</span>
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

                  {/* Trust Badge & payment icons */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>
                      <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
                      <span>Secure 256-Bit SSL checkout</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['UPI', 'GPay', 'PhonePe', 'COD', 'Card'].map(p => (
                        <span key={p} style={{ fontSize: '0.65rem', fontWeight: 700, border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-text-light)', backgroundColor: '#ffffff' }}>{p}</span>
                      ))}
                    </div>
                  </div>

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



