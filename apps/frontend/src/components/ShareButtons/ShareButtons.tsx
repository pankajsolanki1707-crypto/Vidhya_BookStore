'use client';

import React from 'react';
import { Share2, Link as LinkIcon, MessageCircle, Send } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard! 📋');
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`Check out this book at Vidhya Book Store: ${title} - ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleShareTelegram = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`Check out this book at Vidhya Book Store: ${title}`);
      window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Share:</span>
      <button
        onClick={handleCopyLink}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: 'var(--color-bg-light)',
          color: 'var(--color-text-main)',
          transition: 'var(--transition-fast)'
        }}
        title="Copy Link"
      >
        <LinkIcon size={12} />
        <span>Copy Link</span>
      </button>
      <button
        onClick={handleShareWhatsApp}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: '#e6f4ea',
          color: '#137333',
          transition: 'var(--transition-fast)'
        }}
        title="Share on WhatsApp"
      >
        <MessageCircle size={12} />
        <span>WhatsApp</span>
      </button>
      <button
        onClick={handleShareTelegram}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: '#e8f0fe',
          color: '#1a73e8',
          transition: 'var(--transition-fast)'
        }}
        title="Share on Telegram"
      >
        <Send size={12} />
        <span>Telegram</span>
      </button>
    </div>
  );
}
