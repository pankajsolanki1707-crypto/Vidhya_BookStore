'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../info.module.css';

type B2BType = 'bulk' | 'seller' | 'affiliate' | 'gift';

export default function BulkB2BPage() {
  const [activeTab, setActiveTab] = useState<B2BType>('bulk');

  // Form states
  const [instName, setInstName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Your request has been successfully filed under the "${activeTab.toUpperCase()}" desk. Our Bhanwarkuan partnership manager will call you back on: ${phone} 📞`);
    setInstName('');
    setContactName('');
    setPhone('');
    setDetails('');
  };

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Vidhya B2B & Partnerships</h1>
            <p className={styles.pageSubtitle}>Bulk institute supplies, affiliate rewards, merchant selling, and digital gift cards</p>
          </div>

          <div className={styles.policyLayout}>
            {/* Sidebar navigation */}
            <aside className={styles.policySidebar}>
              <button
                onClick={() => setActiveTab('bulk')}
                className={activeTab === 'bulk' ? styles.activePolicyTab : styles.policyTab}
              >
                Bulk & Corporate Orders
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={activeTab === 'seller' ? styles.activePolicyTab : styles.policyTab}
              >
                Become a Seller (Consign)
              </button>
              <button
                onClick={() => setActiveTab('affiliate')}
                className={activeTab === 'affiliate' ? styles.activePolicyTab : styles.policyTab}
              >
                Student Affiliate Network
              </button>
              <button
                onClick={() => setActiveTab('gift')}
                className={activeTab === 'gift' ? styles.activePolicyTab : styles.policyTab}
              >
                Gift Cards
              </button>
            </aside>

            {/* Content card / forms */}
            <main className={styles.policyContentCard}>
              {activeTab === 'bulk' && (
                <div>
                  <h3>Bulk & Corporate Orders Desk</h3>
                  <p>
                    We supply custom coaching bundles, exam printouts, textbooks packages, and stationery kits directly to colleges, universities, hostels, and coaching centres in Indore.
                  </p>
                  <form onSubmit={handleSubmit} className={styles.authForm} style={{ marginTop: '20px' }}>
                    <div className={styles.formGroup}>
                      <label>Coaching Centre / College Name *</label>
                      <input type="text" value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="e.g. Kautilya Academy Branch 2" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Contact Person Name *</label>
                      <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Mr. Sanjay Sharma" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Mobile Number *</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 9876543210" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Detail of Bulk Order Requirements (Quantities & Material) *</label>
                      <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Enter book titles, registry sizes, or print paper formats..." required className={styles.input} style={{ minHeight: '100px' }} />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                      Submit Bulk Quote Request
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'seller' && (
                <div>
                  <h3>Become a Seller (Consign Your Stock)</h3>
                  <p>
                    Are you a local Indore publisher, retired professor, or coaching coordinator? You can list your booklets, reference publications, or test series on the Vidhya platform.
                  </p>
                  <form onSubmit={handleSubmit} className={styles.authForm} style={{ marginTop: '20px' }}>
                    <div className={styles.formGroup}>
                      <label>Publisher / Author / Organization Name *</label>
                      <input type="text" value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="e.g. Mahaveer Publications Representative" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Merchant Contact Mobile *</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Catalog Details *</label>
                      <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="List book titles, category focus, and wholesale margin expectations..." required className={styles.input} style={{ minHeight: '100px' }} />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                      Apply as Merchant
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'affiliate' && (
                <div>
                  <h3>Student Affiliate Program</h3>
                  <p>
                    Recommend Vidhya books to your classmates in hostels or academy batches. Earn <strong>5% cash commission</strong> on every order placed using your custom student referral link!
                  </p>
                  <form onSubmit={handleSubmit} className={styles.authForm} style={{ marginTop: '20px' }}>
                    <div className={styles.formGroup}>
                      <label>Your College / Coaching Center *</label>
                      <input type="text" value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="e.g. SGSITS / Kautilya Academy Batch B" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Your Name *</label>
                      <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Enter full name" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>WhatsApp Contact Number *</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="For reward alerts" required className={styles.input} />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                      Join Affiliate Network
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'gift' && (
                <div>
                  <h3>Vidhya Student Gift Cards</h3>
                  <p>
                    Gift study points to your juniors, friends, or relatives preparing for exams. Buy gift cards online and redeem them directly for books or stationery.
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Gift card system will launch shortly with online checkout! 💳'); }} className={styles.authForm} style={{ marginTop: '20px' }}>
                    <div className={styles.formGroup}>
                      <label>Gift Amount (₹)</label>
                      <select className={styles.input}>
                        <option value="500">₹500 (Basic study kit)</option>
                        <option value="1000">₹1,000 (Polity + History bundle)</option>
                        <option value="2000">₹2,000 (Complete MPPSC Prelims package)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Recipient Email *</label>
                      <input type="email" placeholder="friend@gmail.com" required className={styles.input} />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                      Buy Gift Card
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
