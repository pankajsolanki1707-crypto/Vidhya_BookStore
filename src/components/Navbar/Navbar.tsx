'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Menu, X, BookOpen, Send, PhoneCall } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search suggestions fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?query=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside listener to hide search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?query=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/books/${id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className={styles.header}>
      {/* Top Banner (Contact details) */}
      <div className={styles.topbar}>
        <div className="container">
          <div className={styles.topbarContent}>
            <div className={styles.contactItem}>
              <PhoneCall size={14} />
              <span>Call: <a href="tel:9752809717">9752809717</a></span>
            </div>
            <div className={styles.contactItem}>
              <Send size={14} />
              <span>Telegram Support: <a href="https://t.me/+918982883332" target="_blank" rel="noopener noreferrer">8982883332</a></span>
            </div>
            <div className={styles.announcement}>
              <span>🚚 Free home delivery in Indore on orders above ₹499!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={styles.navbar}>
        <div className="container">
          <div className={styles.navContainer}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <BookOpen size={28} className={styles.logoIcon} />
              <div className={styles.logoText}>
                <span className={styles.brandMain}>VIDHYA</span>
                <span className={styles.brandSub}>BOOK STORE & STATIONERY</span>
              </div>
            </Link>

            {/* Live Search Bar */}
            <div className={styles.searchContainer} ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Search competitive exams, author, stationery, UPSC..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                  <Search size={18} />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (searchQuery.trim() !== '') && (
                <div className={styles.suggestionsDropdown}>
                  {isSearching ? (
                    <div className={styles.searchState}>Searching catalog...</div>
                  ) : suggestions.length > 0 ? (
                    <>
                      <div className={styles.suggestionList}>
                        {suggestions.map((book) => (
                          <div
                            key={book.id}
                            className={styles.suggestionItem}
                            onClick={() => handleSuggestionClick(book.id)}
                          >
                            <img src={book.image} alt={book.title} className={styles.suggestionThumb} />
                            <div className={styles.suggestionInfo}>
                              <h4 className={styles.suggestionTitle}>{book.title}</h4>
                              <p className={styles.suggestionMeta}>
                                By {book.author} | <span className={styles.suggestionCat}>{book.category}</span>
                              </p>
                              <span className={styles.suggestionPrice}>₹{book.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link 
                        href={`/books?query=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setShowSuggestions(false)}
                        className={styles.viewAllSuggestions}
                      >
                        View all search results
                      </Link>
                    </>
                  ) : (
                    <div className={styles.searchState}>No books or stationery items found.</div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className={styles.navMenu}>
              <Link href="/" className={styles.navLink}>Home</Link>
              <Link href="/books" className={styles.navLink}>Browse Books</Link>
              <Link href="/books?category=Stationery" className={styles.navLink}>Stationery</Link>
              <Link href="/admin" className={styles.navLink}>Admin Portal</Link>
            </nav>

            {/* Icons */}
            <div className={styles.navActions}>
              <Link href="/cart" className={styles.cartIconContainer}>
                <ShoppingBag size={24} className={styles.cartIcon} />
                {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearch}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchBtn}>
                <Search size={18} />
              </button>
            </form>
          </div>
          <nav className={styles.mobileLinks}>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Home</Link>
            <Link href="/books" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Browse Books</Link>
            <Link href="/books?category=Competitive%20Exams" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Competitive Exams</Link>
            <Link href="/books?category=Stationery" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Stationery Store</Link>
            <Link href="/books?category=Novels%20%26%20Literature" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Novels & Self-Help</Link>
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Admin Dashboard</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
