'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShoppingCart, User, HelpCircle, Heart } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <BookOpen className="text-primary group-hover:scale-105 transition-transform" size={24} />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm text-primary tracking-wider leading-none">
                VIDHYA BOOK STORE
              </span>
              <span className="text-xxs text-slate-400 font-bold tracking-widest mt-0.5 leading-none">
                & STATIONERY
              </span>
            </div>
          </Link>
          
          {/* Middle Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Link href="/books" className="hover:text-primary transition-colors">Catalog</Link>
            <Link href="/books?category=Used+Books" className="hover:text-primary transition-colors">Used Books</Link>
            <Link href="/books?category=Stationery" className="hover:text-primary transition-colors">Stationery</Link>
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <Link 
              href="/wishlist" 
              className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-full transition-all"
              title="My Wishlist"
            >
              <Heart size={18} />
            </Link>
            <Link 
              href="/cart" 
              className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-full transition-all relative"
              title="Shopping Cart"
            >
              <ShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xxs font-extrabold w-4 h-4 rounded-full flex items-center justify-center scale-90">
                1
              </span>
            </Link>
            <Link 
              href="/auth" 
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-md transition-all shadow-sm flex items-center gap-1.5"
            >
              <User size={12} />
              <span>Login</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
