'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Phone, Mail, MapPin, Send, 
  MessageSquare, ShieldCheck, ArrowRight 
} from 'lucide-react';

export default function Footer() {
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      alert(`Thank you for subscribing! We will send MPPSC/UPSC study reminders and deals to: ${emailInput} ✉️`);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: About & Social Connects */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="text-accent-yellow" size={24} />
            <span className="font-extrabold text-lg tracking-wide uppercase">Vidhya Book Store</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            Indore's trusted offline and online hub for competitive examination study materials, coaching prints, second-hand trade, and college stationery since 2012.
          </p>
          
          <div className="flex items-center gap-3 mt-2 text-slate-500">
            <a href="https://instagram.com/vidhyabookstore" target="_blank" rel="noopener noreferrer" className="hover:text-accent-yellow transition-colors" title="Instagram">
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://t.me/8982883332" target="_blank" rel="noopener noreferrer" className="hover:text-accent-yellow transition-colors">
              <Send size={18} />
            </a>
            <a href="https://wa.me/919752809717" target="_blank" rel="noopener noreferrer" className="hover:text-accent-yellow transition-colors">
              <MessageSquare size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-xs font-semibold">
            <li>
              <Link href="/books" className="hover:text-white hover:underline transition-all">Catalog Search</Link>
            </li>
            <li>
              <Link href="/books?category=Used+Books" className="hover:text-white hover:underline transition-all">Sell Used Books</Link>
            </li>
            <li>
              <Link href="/books?category=Stationery" className="hover:text-white hover:underline transition-all">Stationery Supplies</Link>
            </li>
            <li>
              <Link href="/bulk" className="hover:text-white hover:underline transition-all">Bulk Institution Orders</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-white hover:underline transition-all">Store Gallery Photos</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Service & Policies */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
            Service & Help
          </h3>
          <ul className="space-y-2 text-xs font-semibold">
            <li>
              <Link href="/faq" className="hover:text-white hover:underline transition-all">FAQs / Help Center</Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white hover:underline transition-all">Track Student Order</Link>
            </li>
            <li>
              <Link href="/policies?tab=returns" className="hover:text-white hover:underline transition-all">Refunds & Returns</Link>
            </li>
            <li>
              <Link href="/policies?tab=shipping" className="hover:text-white hover:underline transition-all">Shipping Guidelines</Link>
            </li>
            <li>
              <Link href="/policies?tab=privacy" className="hover:text-white hover:underline transition-all">Privacy Terms</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Store Location */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider border-l-2 border-primary pl-2">
            Newsletter
          </h3>
          <form onSubmit={handleSubscribe} className="bg-slate-900 border border-slate-800 p-1 rounded flex items-center">
            <input 
              type="email" 
              placeholder="Aspirant Email..." 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="bg-transparent border-0 focus:ring-0 focus:outline-none text-xs p-1.5 text-white flex-1 placeholder-slate-600"
              required
            />
            <button type="submit" className="bg-primary hover:bg-primary-hover p-1.5 rounded text-white smooth-transition">
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Simple mock map pointer */}
          <div className="border border-slate-900 rounded p-2.5 bg-slate-900/30 flex items-start gap-2 text-xxs leading-tight">
            <MapPin size={24} className="text-accent-yellow flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300 block">Indore Headquarters</strong>
              <span>B-6, Payal Plaza, Bhanwarkuan, (Kautilya Academy ke niche) Indore, MP - 452001</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar: Payment Badges & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xxs font-bold text-slate-600">
        
        <span>
          © 2026 Vidhya Book Store & Stationery. Crafted with enterprise Next.js.
        </span>

        {/* Payment badges wrapper */}
        <div className="flex items-center gap-3">
          <span className="text-xxs uppercase tracking-wider text-slate-700">Supported Pay Gateway:</span>
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-900 p-1.5 rounded">
            <span className="bg-white text-slate-950 font-extrabold px-1 rounded-sm text-xxs">UPI</span>
            <span className="bg-white text-slate-950 font-extrabold px-1 rounded-sm text-xxs">VISA</span>
            <span className="bg-white text-slate-950 font-extrabold px-1 rounded-sm text-xxs">RUPAY</span>
            <span className="bg-white text-slate-950 font-extrabold px-1 rounded-sm text-xxs">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
