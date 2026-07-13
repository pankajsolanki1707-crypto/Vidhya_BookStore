import React from 'react';
import { Settings, Phone, Send } from 'lucide-react';
import styles from '../info.module.css';

export default function MaintenancePage() {
  return (
    <div className={styles.main} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className={styles.maintenanceCard}>
        <Settings size={48} className="animate-spin" style={{ color: 'var(--color-accent-yellow)' }} />
        
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', fontWeight: 800 }}>Vidhya Bookstore</h1>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', fontWeight: 700 }}>Under Scheduled Maintenance</h2>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          Our online student catalogs are currently undergoing routine database updates to synchronize MPPSC mock test packages and new book releases. We will be back online shortly!
        </p>

        <div style={{ width: '100%', borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Need to place an order urgently? Reach our Bhanwarkuan branch directly:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem' }}>
            <a href="tel:9752809717" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>📞 Call 9752809717</a>
            <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>💬 Telegram Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
