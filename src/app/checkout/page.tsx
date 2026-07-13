'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useCart } from '@/context/CartContext';
import { CreditCard, CheckCircle, ArrowRight, ShieldCheck, ArrowLeft, Send, PhoneCall, HelpCircle, Gift, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';
import styles from './checkout.module.css';

type PaymentType = 'COD' | 'UPI' | 'CARD' | 'NETBANKING';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartCount, clearCart } = useCart();

  // State for shipping details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('');

  // Pincode checker & shipping state
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [isIndoreZone, setIsIndoreZone] = useState(true);
  const [courierPartner, setCourierPartner] = useState('VBS Same-Day Runner');
  const [estDeliveryDate, setEstDeliveryDate] = useState('Same-Day Delivery (by 9 PM today!)');
  const [shippingCharge, setShippingCharge] = useState(0);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('COD');
  const [paymentReference, setPaymentReference] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  
  // Checkout flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Calculate base values for GST Invoice
  const basePriceExclGst = cartTotal / 1.18;
  const cgstVal = basePriceExclGst * 0.09;
  const sgstVal = basePriceExclGst * 0.09;
  const totalGstVal = cartTotal - basePriceExclGst;
  const grandTotal = cartTotal + shippingCharge;

  // Sync shipping charge based on cart total and pincode zone
  useEffect(() => {
    if (isIndoreZone) {
      setShippingCharge(cartTotal >= 499 ? 0 : 49);
    } else {
      setShippingCharge(cartTotal >= 999 ? 0 : 79);
    }
  }, [cartTotal, isIndoreZone]);

  // Pincode check simulator
  useEffect(() => {
    if (pincode.trim().length === 6) {
      setPincodeChecking(true);
      setOrderError('');
      
      const delay = setTimeout(() => {
        setPincodeChecking(false);
        setPincodeChecked(true);

        if (pincode.startsWith('452')) {
          setIsIndoreZone(true);
          setCity('Indore');
          setState('Madhya Pradesh');
          setCourierPartner('VBS Indore Runner');
          setEstDeliveryDate('Same-Day Delivery (by 9:00 PM today!)');
          alert('Indore Core Pincode Checked! Same-day local runner shipping is active. 🚀');
        } else {
          setIsIndoreZone(false);
          setCity('Outstation Hub');
          setState('National India');
          // Simulated Shiprocket Courier choice: Blue Dart or Delhivery
          setCourierPartner('Delhivery Express');
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + 3);
          setEstDeliveryDate(`Estimated Delivery: ${deliveryDate.toDateString()} (by Delhivery/DTDC)`);
          alert('National Pincode Sourced via Shiprocket! Delhivery Surface Delivery is active. 🚚');
        }
      }, 800);

      return () => clearTimeout(delay);
    } else {
      setPincodeChecked(false);
    }
  }, [pincode]);

  // Generate UPI QR Code if payment method is UPI
  useEffect(() => {
    if (paymentMethod !== 'UPI' || grandTotal === 0) return;

    const upiId = '9752809717@okbizaxis';
    const merchantName = 'Vidhya Book Store & Stationery';
    const note = `VBS-Order-${Date.now().toString().slice(-5)}`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

    QRCode.toDataURL(upiUrl, { width: 300, margin: 2 })
      .then(url => setQrCodeUrl(url))
      .catch(err => {
        console.error('Error generating UPI QR code:', err);
      });
  }, [paymentMethod, grandTotal]);

  // Redirect to browse if cart is empty and order is not placed yet
  useEffect(() => {
    if (cart.length === 0 && !successOrder) {
      router.push('/books');
    }
  }, [cart, successOrder, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    setIsSubmitting(true);

    // Validation
    if (!customerName || !phone || !address || !pincode) {
      setOrderError('Please fill in all required shipping fields.');
      setIsSubmitting(false);
      return;
    }

    if (pincode.trim().length !== 6) {
      setOrderError('Please enter a valid 6-digit postal pincode.');
      setIsSubmitting(false);
      return;
    }

    if (paymentMethod === 'UPI' && !paymentReference.trim()) {
      setOrderError('Please provide the 12-digit UPI transaction reference number.');
      setIsSubmitting(false);
      return;
    }

    if (paymentMethod === 'CARD' && (!cardNumber || !cardExpiry || !cardCvv)) {
      setOrderError('Please complete your credit/debit card fields.');
      setIsSubmitting(false);
      return;
    }

    const orderItems = cart.map(item => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          telegram,
          address,
          city,
          state,
          pincode,
          items: orderItems,
          totalAmount: grandTotal,
          paymentMethod,
          paymentReference: paymentMethod === 'UPI' ? paymentReference : `CARD-${Date.now().toString().slice(-4)}`
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || 'Failed to place order.');
      } else {
        setSuccessOrder(data.order);
        clearCart();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setOrderError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully placed, display confirmation screen
  if (successOrder) {
    const telegramMessage = `Hi Vidhya Book Store, I placed order *${successOrder.id}* for Rs *₹${successOrder.totalAmount}*. Details:\nName: ${successOrder.customerName}\nPhone: ${successOrder.phone}\nAddress: ${successOrder.address}`;
    const whatsAppMessage = `Hi Vidhya Book Store, I placed order *${successOrder.id}* for Rs *₹${successOrder.totalAmount}*. Details:\nName: ${successOrder.customerName}\nPhone: ${successOrder.phone}\nAddress: ${successOrder.address}`;

    return (
      <div className={styles.main}>
        <Navbar />
        <section className={styles.checkoutSection}>
          <div className="container">
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle size={40} />
              </div>
              <h2 className={styles.successTitle}>Order Placed Successfully!</h2>
              <p className={styles.successText}>
                Thank you for shopping with us. Your order has been registered in our local delivery ledger. We will process and ship your items shortly.
              </p>
              
              <div className={styles.orderIdBadge}>
                Order ID: {successOrder.id}
              </div>

              {/* GST Invoice Details summary */}
              <div style={{ margin: '20px 0', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', backgroundColor: 'var(--color-bg-light)', textAlign: 'left' }}>
                <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                  GST Tax Invoice Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal (Excl. Tax)</span>
                    <span>₹{basePriceExclGst.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CGST (9%)</span>
                    <span>₹{cgstVal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>SGST (9%)</span>
                    <span>₹{sgstVal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Courier Charge ({courierPartner})</span>
                    <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--color-border)', paddingTop: '6px', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                    <span>Grand Total Paid (Incl. GST)</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Telegram/WhatsApp Contact Shortcuts */}
              <div className={styles.localContactBlock}>
                <h4 className={styles.localContactTitle}>⚡ Double Confirm & Send Receipt</h4>
                <p className={styles.successText} style={{ fontSize: '0.85rem' }}>
                  Please share your Order ID and payment receipt with us on Telegram or WhatsApp for super fast shipping confirmations!
                </p>
                <div className={styles.contactActionsGrid}>
                  <a
                    href={`https://wa.me/919752809717?text=${encodeURIComponent(whatsAppMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactBtnWhatsApp}
                  >
                    <span>Send on WhatsApp</span>
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent('https://vidhyabookstore.com')}&text=${encodeURIComponent(telegramMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactBtnTelegram}
                  >
                    <span>Send on Telegram</span>
                  </a>
                </div>
              </div>

              <Link href="/books" className="btn-primary" style={{ marginTop: '10px' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.checkoutSection}>
        <div className="container">
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ArrowRight size={12} style={{ display: 'inline', margin: '0 8px', verticalAlign: 'middle' }} />
            <Link href="/cart" className={styles.breadcrumbLink}>Cart</Link>
            <ArrowRight size={12} style={{ display: 'inline', margin: '0 8px', verticalAlign: 'middle' }} />
            <span className={styles.breadcrumbCurrent}>Checkout</span>
          </div>

          <h1 className={styles.pageTitle}>Secure Checkout</h1>

          {orderError && (
            <div className={styles.errorAlert} style={{ color: 'var(--color-error)', backgroundColor: 'rgba(239,68,68,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-error)', marginBottom: '24px', fontWeight: '500' }}>
              ⚠️ {orderError}
            </div>
          )}

          <div className={styles.checkoutGrid}>
            {/* Form Column */}
            <form onSubmit={handleSubmitOrder} className={styles.formCard}>
              <h3 className={styles.cardTitle}>Shipping Address</h3>
              
              <div className={styles.formGrid}>
                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aditya Sharma"
                    className={styles.input}
                    required
                  />
                </div>

                {/* Phone */}
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Contact Mobile Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className={styles.input}
                    required
                  />
                </div>

                {/* Telegram handle */}
                <div className={styles.formGroupFull}>
                  <label htmlFor="telegram">Telegram Username (Optional)</label>
                  <input
                    type="text"
                    id="telegram"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="e.g. aditya_mppsc"
                    className={styles.input}
                  />
                </div>

                {/* Address */}
                <div className={styles.formGroupFull}>
                  <label htmlFor="address">Street Address (House No, Area, Landmark) *</label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Room 24, Jagat Hostels, Near Kautilya Academy, Bhanwarkuan"
                    className={styles.textarea}
                    required
                  />
                </div>

                {/* Pincode */}
                <div className={styles.formGroup}>
                  <label htmlFor="pincode">6-Digit Pincode *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      id="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 452001"
                      className={styles.input}
                      maxLength={6}
                      required
                    />
                    {pincodeChecking && (
                      <span style={{ position: 'absolute', right: '12px', top: '12px' }}>
                        <Loader2 className="animate-spin" size={16} />
                      </span>
                    )}
                  </div>
                </div>

                {/* City */}
                <div className={styles.formGroup}>
                  <label htmlFor="city">City / Hub Zone</label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    className={styles.input}
                    disabled
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Shipping partner status */}
              {pincodeChecked && (
                <div style={{ marginTop: '16px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                    🚚 Courier Logistics Assigned:
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Provider: <strong>{courierPartner}</strong> | {estDeliveryDate}
                  </span>
                </div>
              )}

              {/* Payment Methods */}
              <h3 className={styles.cardTitle} style={{ marginTop: '24px' }}>Payment Mode</h3>
              <div className={styles.paymentSelector} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div
                  className={paymentMethod === 'COD' ? styles.activePaymentOption : styles.paymentOption}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <CreditCard size={20} />
                  <span>Cash on Delivery (COD)</span>
                </div>
                <div
                  className={paymentMethod === 'UPI' ? styles.activePaymentOption : styles.paymentOption}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <Send size={20} />
                  <span>UPI Scan QR</span>
                </div>
                <div
                  className={paymentMethod === 'CARD' ? styles.activePaymentOption : styles.paymentOption}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <CreditCard size={20} />
                  <span>Debit/Credit Card</span>
                </div>
                <div
                  className={paymentMethod === 'NETBANKING' ? styles.activePaymentOption : styles.paymentOption}
                  onClick={() => setPaymentMethod('NETBANKING')}
                >
                  <CheckCircle size={20} />
                  <span>Net Banking</span>
                </div>
              </div>

              {/* QR Code box for UPI */}
              {paymentMethod === 'UPI' && (
                <div className={styles.upiContainer} style={{ marginTop: '20px' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Scan QR using PhonePe / GPay / Paytm</h4>
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="UPI Payment QR Code" className={styles.qrCode} style={{ margin: '14px 0', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
                  ) : (
                    <div>Generating secure UPI QR...</div>
                  )}
                  <p className={styles.upiInstructions}>
                    Pay exactly <strong>₹{grandTotal}</strong> to Vidhya Book Store.<br />
                    UPI Merchant VPA: <strong>9752809717@okbizaxis</strong>
                  </p>
                  
                  <div className={styles.formGroupFull} style={{ marginTop: '10px', textAlign: 'left' }}>
                    <label htmlFor="ref">UPI Transaction ID / Ref Number *</label>
                    <input
                      type="text"
                      id="ref"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Enter 12-digit UTR / Reference number"
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Cards Panel */}
              {paymentMethod === 'CARD' && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Secure Razorpay Card Gateway</h4>
                  <div className={styles.formGroup}>
                    <label>Card Number *</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" maxLength={16} className={styles.input} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className={styles.formGroup}>
                      <label>Expiry Date *</label>
                      <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>CVV Code *</label>
                      <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="•••" maxLength={3} className={styles.input} />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Panel */}
              {paymentMethod === 'NETBANKING' && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: '700', marginBottom: '10px' }}>Select Sourced Net Banking</h4>
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className={styles.select} style={{ width: '100%' }}>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                  </select>
                </div>
              )}
            </form>

            {/* Summary Column */}
            <div className={styles.summaryCol}>
              <div className={styles.summaryCard}>
                <h3 className={styles.cardTitle}>Review Order</h3>

                {/* Items List */}
                <div className={styles.itemsReviewList}>
                  {cart.map((item) => (
                    <div key={item.product.id} className={styles.reviewItem}>
                      <img src={item.product.image} alt={item.product.title} className={styles.reviewThumb} />
                      <div className={styles.reviewInfo}>
                        <h4 className={styles.reviewTitle}>{item.product.title}</h4>
                        <span className={styles.reviewQtyPrice}>
                          {item.quantity} x ₹{item.product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className={styles.pricingRows}>
                  <div className={styles.pricingRow}>
                    <span>Items Total ({cartCount})</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className={styles.pricingRow}>
                    <span>Subtotal (Excl. Tax)</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>₹{basePriceExclGst.toFixed(2)}</span>
                  </div>
                  <div className={styles.pricingRow}>
                    <span>18% GST (CGST + SGST)</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>₹{totalGstVal.toFixed(2)}</span>
                  </div>
                  <div className={styles.pricingRow}>
                    <span>Courier Delivery Fee</span>
                    <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                  </div>
                  <div className={styles.grandTotalRow}>
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmitOrder}
                  className={styles.submitOrderBtn}
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm Order (₹${grandTotal})`}
                  <ArrowRight size={18} />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontSize: '0.75rem', justifyContent: 'center' }}>
                  <ShieldCheck size={14} />
                  <span>Secure 256-Bit SSL Registry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
