'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../info.module.css';

type PolicyType = 'returns' | 'shipping' | 'privacy' | 'terms';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<PolicyType>('returns');

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Vidhya Policies & Terms</h1>
            <p className={styles.pageSubtitle}>Review our delivery shipping terms, cancellation rules, and legal terms</p>
          </div>

          <div className={styles.policyLayout}>
            {/* Sidebar navigation */}
            <aside className={styles.policySidebar}>
              <button
                onClick={() => setActiveTab('returns')}
                className={activeTab === 'returns' ? styles.activePolicyTab : styles.policyTab}
              >
                Returns & Refund Policy
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={activeTab === 'shipping' ? styles.activePolicyTab : styles.policyTab}
              >
                Shipping & Delivery
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={activeTab === 'privacy' ? styles.activePolicyTab : styles.policyTab}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={activeTab === 'terms' ? styles.activePolicyTab : styles.policyTab}
              >
                Terms, Conditions & Disclaimer
              </button>
            </aside>

            {/* Content card */}
            <main className={styles.policyContentCard}>
              {activeTab === 'returns' && (
                <div>
                  <h3>Returns, Refund & Cancellation Policy</h3>
                  <p><strong>Last Updated: July 2026</strong></p>
                  <p>
                    At Vidhya Book Store, we strive to ensure 100% student satisfaction. We understand that study requirements change, and mock syllabus prints may vary.
                  </p>

                  <h4>1. Returns Eligibility</h4>
                  <ul>
                    <li>Books must be returned within <strong>7 days</strong> of delivery.</li>
                    <li>Items must be in original condition, with no markings, highlights, dog-eared pages, or torn covers.</li>
                    <li>Premium stationery (e.g. Parker pens, Casio scientific calculators) must be in their original unopened packaging.</li>
                    <li>Custom printed academy note printouts cannot be returned once ordered unless defective.</li>
                  </ul>

                  <h4>2. Refund Processing</h4>
                  <p>
                    Refunds are processed back to the original payment method (UPI/Netbanking) within <strong>3-5 working days</strong> after the returned book passes inspection at our physical Bhanwarkuan branch.
                  </p>

                  <h4>3. Cancellations</h4>
                  <p>
                    You can cancel your order at no cost before it leaves our storefront. Once the runner has left Bhanwarkuan for delivery, a flat cancellation fee of ₹49 is charged to cover shipping costs.
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h3>Shipping & Delivery Policy</h3>
                  <p><strong>Last Updated: July 2026</strong></p>
                  <p>
                    We operate a highly efficient local logistics network catering directly to hostels, colleges, and residences across Indore, Madhya Pradesh.
                  </p>

                  <h4>1. Delivery Areas & Speed</h4>
                  <ul>
                    <li><strong>Bhanwarkuan Core (Radius 2km):</strong> Delivered within <strong>3-4 hours</strong> on same-day.</li>
                    <li><strong>Greater Indore (Vijay Nagar, Rajendra Nagar, Palasia):</strong> Delivered within <strong>6-8 hours</strong> or next-day morning.</li>
                    <li><strong>Rest of MP/India:</strong> Dispatched via speed-post within 24 hours. Delivery takes 3-5 working days.</li>
                  </ul>

                  <h4>2. Delivery Rates</h4>
                  <ul>
                    <li>Free shipping on all Indore student orders above <strong>₹499</strong>.</li>
                    <li>Orders below ₹499 incur a flat local runner delivery fee of <strong>₹49</strong>.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h3>Privacy Policy</h3>
                  <p><strong>Last Updated: July 2026</strong></p>
                  <p>
                    Your trust is our priority. We collect minimal personal details (Name, delivery address, phone, email) to process purchases and verify UPI transactions.
                  </p>
                  <h4>1. Data Protection</h4>
                  <p>
                    Vidhya Book Store does not sell, lease, or share customer emails or phone numbers with third-party marketing networks.
                  </p>
                  <h4>2. UPI Secure Transactions</h4>
                  <p>
                    Payments are handled securely via official UPI banking gateways. We only record the transaction reference number provided by you to confirm orders.
                  </p>
                </div>
              )}

              {activeTab === 'terms' && (
                <div>
                  <h3>Terms, Conditions & Legal Disclaimer</h3>
                  <p><strong>Last Updated: July 2026</strong></p>
                  <p>
                    By accessing and purchasing from our online store or physical retail storefront, you agree to these legal conditions:
                  </p>
                  <h4>1. Academic Disclaimer</h4>
                  <p>
                    Vidhya Book Store & Stationery distributes materials published by external entities (e.g. Kautilya Academy Publications, McGraw Hill, S. Chand). We are not liable for typographical syllabus errors, out-of-date answers, or curriculum modifications made by exam boards (UPSC, MPPSC, DAVV).
                  </p>
                  <h4>2. Pricing Discrepancies</h4>
                  <p>
                    While we maintain catalog accuracy, pricing discrepancies may occur. If a textbook's actual MRP varies from our web listing, we will contact you for confirmation before finalizing order shipments.
                  </p>
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
