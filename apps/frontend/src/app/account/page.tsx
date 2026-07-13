'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useCart } from '@/context/CartContext';
import { 
  User, Package, MapPin, LifeBuoy, Compass, MapPinned, 
  CheckCircle2, ChevronRight, Wallet, Gift, Bell, Share2, Printer, RefreshCcw 
} from 'lucide-react';
import styles from '../user.module.css';

export default function AccountPage() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'track' | 'addresses' | 'support' | 'wallet' | 'promotions'>('profile');
  const [userEmail, setUserEmail] = useState('student@vidhya.com');
  const [userName, setUserName] = useState('Aditya Sharma');
  const [userPhone, setUserPhone] = useState('9876543210');
  
  // Track order states
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');

  // Support states
  const [ticketSubject, setTicketSubject] = useState('Delivery Delay');
  const [ticketMessage, setTicketMessage] = useState('');

  // Wallet & Reward points states
  const [walletBalance, setWalletBalance] = useState(150);
  const [rewardPoints, setRewardPoints] = useState(340);
  
  // Gift card state
  const [giftCardInput, setGiftCardInput] = useState('');

  // Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vbs_user_token');
    if (saved) {
      setUserEmail(saved);
      const namePart = saved.split('@')[0];
      setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1).replace('.', ' '));
    }
  }, []);

  // Mock Orders
  const mockOrders = [
    {
      id: 'VBS-98715-4310',
      date: '2026-07-10',
      total: 1250,
      status: 'Confirmed',
      items: 'MPPSC Prelims GS Study Kit x 1'
    },
    {
      id: 'VBS-92410-8512',
      date: '2026-06-25',
      total: 795,
      status: 'Delivered',
      items: 'Indian Polity (Laxmikanth) 7th Ed x 1'
    }
  ];

  // Reorder action (adds order items to cart and redirects)
  const handleReorder = (order: any) => {
    // Generate a mock product matching the order items
    const mockProduct = {
      id: order.id.includes('98715') ? 'mppsc-prelims-kautilya-1' : 'upsc-polity-laxmikanth',
      title: order.items.split(' x ')[0],
      author: order.id.includes('98715') ? 'Kautilya Academy Experts' : 'M. Laxmikanth',
      publisher: order.id.includes('98715') ? 'Kautilya Academy' : 'McGraw Hill',
      price: order.total,
      image: order.id.includes('98715') 
        ? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=60',
      format: 'Paperback',
      category: 'Competitive Exams',
      inStock: true,
      stockCount: 10
    };

    addToCart(mockProduct as any);
    alert('Items from this order added to cart successfully! Redirecting...');
    window.location.href = '/cart';
  };

  // Printable Invoice generator for customer
  const handleDownloadInvoice = (order: any) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.5; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .details { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; border: 1px solid #ccc; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-weight: bold; font-size: 1.25rem; margin-top: 20px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <div>
              <h2>VIDHYA BOOK STORE</h2>
              <p>B-6, Payal Plaza, Bhanwarkuan, Indore<br/>Phone: 9752809717</p>
            </div>
            <div>
              <h3>INVOICE</h3>
              <p>Invoice No: INV-${order.id.slice(-6).toUpperCase()}<br/>Date: ${order.date}</p>
            </div>
          </div>
          <div class="details">
            <h4>Billed To:</h4>
            <p><strong>Customer Name:</strong> ${userName}<br/><strong>Phone:</strong> ${userPhone}<br/><strong>Shipping Address:</strong> Room 24, Jagat Hostels, Bhanwarkuan Indore</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Items Ordered</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.items}</td>
                <td>1</td>
                <td>₹${order.total}</td>
                <td>₹${order.total}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total Paid: ₹${order.total}</div>
        </body>
      </html>
    `);
    w.document.close();
  };

  // Convert points to cash
  const handleConvertPoints = () => {
    if (rewardPoints >= 100) {
      setRewardPoints(prev => prev - 100);
      setWalletBalance(prev => prev + 10);
      alert('Converted 100 reward points into ₹10 Wallet Cash successfully! ✓');
    } else {
      alert('You need at least 100 reward points to redeem.');
    }
  };

  const handleRedeemGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftCardInput.trim().toUpperCase() === 'VBSGIFT250') {
      setWalletBalance(prev => prev + 250);
      setGiftCardInput('');
      alert('Gift Card claimed successfully! ₹250 added to your VBS Wallet. 💳');
    } else {
      alert('Invalid Gift Card code. Try checking for uppercase spelling.');
    }
  };

  // Tracking Trigger
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);

    if (!trackOrderId.trim()) {
      setTrackError('Please enter a valid Order ID.');
      return;
    }

    const match = mockOrders.find(o => o.id.toLowerCase() === trackOrderId.trim().toLowerCase()) || {
      id: trackOrderId.trim().toUpperCase(),
      date: new Date().toISOString().slice(0,10),
      total: 490,
      status: 'Shipped',
      items: 'Study guides & Stationery items'
    };

    setTrackedOrder(match);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Support ticket submitted! Ticket reference number: #TKT-${Date.now().toString().slice(-5)}. We will contact you soon on WhatsApp or email.`);
    setTicketMessage('');
  };

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.accountLayout}>
            {/* Sidebar navigation */}
            <aside className={styles.accountSidebar}>
              <div className={styles.profileSummary}>
                <div className={styles.avatar}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileMeta}>
                  <h4>{userName}</h4>
                  <p>{userEmail}</p>
                </div>
              </div>

              <nav className={styles.sidebarMenu}>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={activeTab === 'profile' ? styles.activeMenuItem : styles.menuItem}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={activeTab === 'orders' ? styles.activeMenuItem : styles.menuItem}
                >
                  <Package size={16} />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className={activeTab === 'track' ? styles.activeMenuItem : styles.menuItem}
                >
                  <Compass size={16} />
                  <span>Track Order</span>
                </button>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={activeTab === 'wallet' ? styles.activeMenuItem : styles.menuItem}
                >
                  <Wallet size={16} />
                  <span>Wallet & Rewards</span>
                </button>
                <button
                  onClick={() => setActiveTab('promotions')}
                  className={activeTab === 'promotions' ? styles.activeMenuItem : styles.menuItem}
                >
                  <Bell size={16} />
                  <span>Alerts & Referral</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={activeTab === 'addresses' ? styles.activeMenuItem : styles.menuItem}
                >
                  <MapPin size={16} />
                  <span>Saved Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={activeTab === 'support' ? styles.activeMenuItem : styles.menuItem}
                >
                  <LifeBuoy size={16} />
                  <span>Get Support</span>
                </button>
              </nav>
            </aside>

            {/* Main Content Pane */}
            <main className={styles.dashboardContent}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h3>Account Profile</h3>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Profile details updated successfully! ✓'); }} className={styles.authForm}>
                    <div className={styles.formGroup}>
                      <label>Full Name *</label>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Mobile Number *</label>
                      <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input type="email" value={userEmail} disabled className={styles.input} style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                    <button type="submit" className={styles.authSubmitBtn} style={{ marginTop: '10px', width: 'auto', padding: '12px 30px' }}>
                      Update Profile
                    </button>
                  </form>
                </div>
              )}

              {/* My Orders Tab (with Reorder & Download Invoice) */}
              {activeTab === 'orders' && (
                <div>
                  <h3>Purchase History</h3>
                  <div className={styles.ordersGrid}>
                    {mockOrders.map((order) => (
                      <div key={order.id} className={styles.orderRow}>
                        <div className={styles.orderInfo}>
                          <h4>Order ID: {order.id}</h4>
                          <p>Placed on: {order.date} | Items: {order.items}</p>
                          <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                            <button 
                              onClick={() => handleReorder(order)} 
                              style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <RefreshCcw size={12} />
                              Reorder items
                            </button>
                            <button 
                              onClick={() => handleDownloadInvoice(order)} 
                              style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Printer size={12} />
                              Download Invoice
                            </button>
                          </div>
                        </div>
                        <span className={`${styles.orderStatusPill} ${
                          order.status === 'Pending' ? styles.statusPending :
                          order.status === 'Confirmed' ? styles.statusConfirmed :
                          order.status === 'Shipped' ? styles.statusShipped :
                          order.status === 'Delivered' ? styles.statusDelivered :
                          styles.statusCancelled
                        }`}>
                          {order.status}
                        </span>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          ₹{order.total}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Track Order Tab */}
              {activeTab === 'track' && (
                <div>
                  <h3>Track Shipment Progress</h3>
                  
                  <div className={styles.trackerWidget}>
                    <form onSubmit={handleTrackOrder} className={styles.trackerForm}>
                      <input
                        type="text"
                        placeholder="Enter Order ID (e.g. VBS-98715-4310)"
                        value={trackOrderId}
                        onChange={(e) => setTrackOrderId(e.target.value)}
                        className={styles.input}
                        style={{ flex: 1 }}
                      />
                      <button type="submit" className={styles.authSubmitBtn} style={{ width: 'auto', padding: '0 24px' }}>
                        Track
                      </button>
                    </form>
                    {trackError && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '8px', fontWeight: 600 }}>⚠️ {trackError}</div>}
                  </div>

                  {trackedOrder && (
                    <div style={{ marginTop: '30px' }}>
                      <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '6px' }}>Status for {trackedOrder.id}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Estimated Delivery: Same-Day to Bhanwarkuan</p>
                      
                      <div className={styles.trackerSteps}>
                        <div className={styles.trackerStepActive}>
                          <div className={styles.stepDot}>1</div>
                          <span className={styles.stepLabel}>Order Placed</span>
                        </div>
                        <div className={
                          ['Confirmed', 'Shipped', 'Delivered'].includes(trackedOrder.status) ? styles.trackerStepActive : styles.trackerStep
                        }>
                          <div className={styles.stepDot}>2</div>
                          <span className={styles.stepLabel}>Confirmed</span>
                        </div>
                        <div className={
                          ['Shipped', 'Delivered'].includes(trackedOrder.status) ? styles.trackerStepActive : styles.trackerStep
                        }>
                          <div className={styles.stepDot}>3</div>
                          <span className={styles.stepLabel}>Shipped</span>
                        </div>
                        <div className={
                          trackedOrder.status === 'Delivered' ? styles.trackerStepActive : styles.trackerStep
                        }>
                          <div className={styles.stepDot}>4</div>
                          <span className={styles.stepLabel}>Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wallet & Rewards Tab */}
              {activeTab === 'wallet' && (
                <div>
                  <h3>VBS Wallet & Student Rewards</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
                    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                      <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>VBS Wallet Balance</h4>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '8px 0' }}>
                        ₹{walletBalance}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Can be used directly at checkout for study guides or calculators.</p>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                      <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Aspirant Reward Points</h4>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '8px 0' }}>
                        {rewardPoints} pts
                      </div>
                      <button onClick={handleConvertPoints} className="btn-accent" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                        Convert 100 points to ₹10 Cash
                      </button>
                    </div>
                  </div>

                  <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, margin: '24px 0 10px 0' }}>Recent Wallet Transactions</h4>
                  <div className={styles.ordersGrid}>
                    <div className={styles.orderRow} style={{ padding: '12px 20px' }}>
                      <div className={styles.orderInfo}>
                        <h4 style={{ fontSize: '0.85rem' }}>Refund Credited for Order VBS-8512</h4>
                        <p style={{ fontSize: '0.7rem' }}>Wallet Balance Credit</p>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>+₹150</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Promotions, Referrals & Alerts Tab */}
              {activeTab === 'promotions' && (
                <div>
                  <h3>Promotions & Referrals Desk</h3>

                  {/* Refer & Earn */}
                  <div style={{ padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)', marginBottom: '24px' }}>
                    <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Refer & Earn Program</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '6px 0 12px 0', lineHeight: 1.4 }}>
                      Invite your batchmates or hostel friends to buy registers, stationery, and Kautilya Academy notes. Earn **₹50 Cash** added to your VBS wallet on their first purchase!
                    </p>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '6px 16px', borderRadius: '4px', letterSpacing: '1px' }}>
                        ADITYA50VBS
                      </span>
                      <button onClick={() => { navigator.clipboard.writeText('ADITYA50VBS'); alert('Referral code copied! Share with friends. ✓'); }} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        <Share2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> Copy Code
                      </button>
                    </div>
                  </div>

                  {/* Gift cards claim */}
                  <form onSubmit={handleRedeemGiftCard} style={{ padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)', marginBottom: '24px' }}>
                    <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Claim Bookstore Gift Card</h4>
                    <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Enter 10-digit Gift Card Pin (e.g. VBSGIFT250)" 
                        value={giftCardInput}
                        onChange={(e) => setGiftCardInput(e.target.value)}
                        className={styles.input} 
                        style={{ flex: 1 }} 
                      />
                      <button type="submit" className="btn-accent" style={{ padding: '0 20px' }}>
                        Redeem Card
                      </button>
                    </div>
                  </form>

                  {/* Push alerts notifications */}
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '10px' }}>Recent Alerts & Notifications</h4>
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px', borderBottom: '1px solid var(--color-border)', backgroundColor: '#ffffff', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <Bell size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>MPPSC Mains print sets are updated at Bhanwarkuan outlet</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>1 day ago | Sourced new civil services worksheets.</p>
                      </div>
                    </div>
                    <div style={{ padding: '14px', backgroundColor: '#ffffff', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <Bell size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>Welcome to Vidhya Bookstore!</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>5 days ago | Sourced 340 signup reward points to your account.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <h3>Shipping Address Book</h3>
                  <div className={styles.addressGrid}>
                    <div className={styles.addressCard}>
                      <h4>
                        <span>Home / Hostel</span>
                        <span className={styles.addressBadge}>Default</span>
                      </h4>
                      <p className={styles.addressText}>
                        <strong>Aditya Sharma</strong><br />
                        Room 24, Jagat Hostels,<br />
                        Near Payal Plaza, Bhanwarkuan<br />
                        Indore, Madhya Pradesh - 452001<br />
                        Phone: 9876543210
                      </p>
                    </div>
                    <div className={styles.addressCard} style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => alert('New Address adding logic coming soon!')}>
                      <MapPinned size={32} style={{ color: 'var(--color-primary)', opacity: 0.6 }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>Add New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Tab */}
              {activeTab === 'support' && (
                <div>
                  <h3>Customer Helpdesk Support</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                    Need urgent shipping help? Submit your issue below or contact store support instantly on Telegram at <strong>8982883332</strong>.
                  </p>
                  <form onSubmit={handleSupportSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                      <label>Subject</label>
                      <select value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} className={styles.input}>
                        <option value="Delivery Delay">Indore Delivery Delay</option>
                        <option value="Used Books Inquiry">Used Books Trade Rates</option>
                        <option value="Incorrect Books Received">Incorrect Guides Sourced</option>
                        <option value="Stationery Replacement">Stationery Defects</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Describe Your Query *</label>
                      <textarea
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Detail your order ID and the issue you are facing..."
                        required
                        className={styles.input}
                        style={{ resize: 'vertical', minHeight: '100px' }}
                      />
                    </div>
                    <button type="submit" className={styles.authSubmitBtn} style={{ marginTop: '10px', width: 'auto', padding: '12px 30px' }}>
                      Submit Support Ticket
                    </button>
                  </form>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
