'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/app/home.module.css';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "What are the opening and closing hours of the store?",
      answer: "Vidhya Book Store & Stationery is open daily from 9:30 AM to 9:30 PM (including Sundays). Visit us at Payal Plaza, right below Kautilya Academy in Bhanwarkuan, Indore."
    },
    {
      question: "Do you buy used books or accept old textbooks for trade?",
      answer: "Yes! We buy used school books, college textbooks, and competitive exam prep guides (UPSC, MPPSC, Vyapam, JEE, NEET) in decent condition. You can trade them for cash or get direct credit discounts on new books."
    },
    {
      question: "Is home delivery available for students in Indore hostels?",
      answer: "Absolutely. We offer free home/hostel delivery across Indore on all orders above ₹499. Orders below ₹499 incur a flat delivery fee of ₹49. Most deliveries in Bhanwarkuan, Geeta Bhawan, and Navlakha are completed same-day within 3-4 hours."
    },
    {
      question: "How does online payment and order confirmations work?",
      answer: "You can place your order online, choose 'Scan & Pay (UPI)', scan our dynamic QR code, and pay using any UPI app (PhonePe, Paytm, GPay, BHIM). After scanning and making the payment, enter the 12-digit transaction ID. You can also share your order receipt with us directly on WhatsApp or Telegram for instant verification."
    },
    {
      question: "Can I install the Vidhya Books website as an app on my phone?",
      answer: "Yes! Our website is a Progressive Web App (PWA). If you visit our website on Google Chrome (Android/Desktop) or Safari (iOS), you will see an 'Install App' banner or menu shortcut. This adds a launcher icon to your phone screen and lets you browse our catalogs offline."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqGrid}>
      {faqs.map((faq, i) => (
        <div key={i} className={styles.faqItem}>
          <div className={styles.faqHeader} onClick={() => toggle(i)}>
            <span className={styles.faqQuestion}>{faq.question}</span>
            <span className={styles.faqIcon}>
              {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </div>
          {openIndex === i && (
            <div className={styles.faqBody}>
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
