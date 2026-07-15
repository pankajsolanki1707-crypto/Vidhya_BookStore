'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Menu, X, BookOpen, Send, PhoneCall, GitCompare, Trash2, Mic, MicOff } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const [activeIndex, setActiveIndex] = useState(-1);
  const [compareItems, setCompareItems] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky navigation shadows
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotating Announcement Bar state
  const announcements = [
    "🚚 Free Indore delivery on orders above ₹499!",
    "🔥 Today's Offer: Use code VIDHYA10 for 10% Off!",
    "📞 Call Support: 9752809717",
    "💬 WhatsApp Support: 9752809717"
  ];
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Sync comparison items from localStorage
  useEffect(() => {
    const loadCompare = () => {
      try {
        const stored = localStorage.getItem('vbs_compare');
        if (stored) {
          setCompareItems(JSON.parse(stored));
        } else {
          setCompareItems([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadCompare();
    window.addEventListener('vbs_compare_changed', loadCompare);
    return () => window.removeEventListener('vbs_compare_changed', loadCompare);
  }, []);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vbs_search_history');
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRemoveCompareItem = (id: string) => {
    const updated = compareItems.filter(item => item.id !== id);
    setCompareItems(updated);
    localStorage.setItem('vbs_compare', JSON.stringify(updated));
    window.dispatchEvent(new Event('vbs_compare_changed'));
  };

  const handleClearAllCompare = () => {
    setCompareItems([]);
    localStorage.removeItem('vbs_compare');
    window.dispatchEvent(new Event('vbs_compare_changed'));
  };


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
          setActiveIndex(-1); // Reset index on new query
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

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

  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const cleanTerm = searchTerm.trim();
    const updated = [cleanTerm, ...searchHistory.filter(h => h !== cleanTerm)].slice(0, 5);
    setSearchHistory(updated);
    try {
      localStorage.setItem('vbs_search_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToHistory(searchQuery);
      router.push(`/books?query=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/books/${id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    const totalItems = suggestions.length;
    if (totalItems === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < totalItems) {
        e.preventDefault();
        const selected = suggestions[activeIndex];
        router.push(`/books/${selected.id}`);
        setSearchQuery('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Chrome, Safari or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      saveToHistory(transcript);
      router.push(`/books?query=${encodeURIComponent(transcript)}`);
      setShowSuggestions(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} style={{ backgroundColor: '#FCD116', color: 'inherit', padding: '0 2px', borderRadius: '2px', fontWeight: 'bold' }}>{part}</mark> 
            : part
        )}
      </span>
    );
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
              <span>{announcements[currentAnnouncementIndex]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className="container">
          {/* Row 1: Logo, Search, and Actions */}
          <div className={styles.navbarFirstRow}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <BookOpen size={24} className={styles.logoIcon} />
              <div className={styles.logoText}>
                <span className={styles.brandMain}>VIDHYA</span>
                <span className={styles.brandSub}>BOOK STORE</span>
              </div>
            </Link>

            {/* Centered Search Bar */}
            <div className={styles.headerSearchContainer} ref={searchRef}>
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
                  onKeyDown={handleKeyDown}
                  className={styles.searchInput}
                />
                
                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={styles.voiceSearchBtn}
                  title="Voice Search"
                >
                  {isListening ? <MicOff size={16} style={{ color: 'var(--color-error)' }} /> : <Mic size={16} />}
                </button>

                <button type="submit" className={styles.searchBtn}>
                  <Search size={18} />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className={styles.suggestionsDropdown}>
                  {searchQuery.trim() === '' ? (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {searchHistory.length > 0 && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Recent Searches</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchHistory([]);
                                localStorage.removeItem('vbs_search_history');
                              }}
                              style={{ fontSize: '0.75rem', color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              Clear All
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {searchHistory.map((h, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(h);
                                  router.push(`/books?query=${encodeURIComponent(h)}`);
                                  setShowSuggestions(false);
                                }}
                                style={{
                                  fontSize: '0.78rem',
                                  padding: '5px 12px',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: 'var(--color-bg-light)',
                                  cursor: 'pointer',
                                  color: 'var(--color-text-main)'
                                }}
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>Trending &amp; Popular Searches</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {[
                            { label: '🦁 MPPSC Prep', query: 'MPPSC' },
                            { label: '🏛️ UPSC Polity', query: 'Polity' },
                            { label: '🧮 Casio Calculator', query: 'Casio' },
                            { label: '📚 Novels', query: 'Novel' },
                            { label: '🔄 Used Books', query: 'Used' }
                          ].map((t, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                  setSearchQuery(t.query);
                                  router.push(`/books?query=${encodeURIComponent(t.query)}`);
                                  setShowSuggestions(false);
                              }}
                              style={{
                                fontSize: '0.78rem',
                                padding: '5px 12px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--color-bg-light)',
                                cursor: 'pointer',
                                color: 'var(--color-text-main)'
                              }}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : isSearching ? (
                    <div className={styles.searchState}>Searching catalog...</div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {/* matching attributes category, author */}
                      {(() => {
                        const matchedCats = Array.from(new Set(suggestions.map(s => s.category).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))));
                        const matchedAuths = Array.from(new Set(suggestions.map(s => s.author).filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()))));
                        if (matchedCats.length === 0 && matchedAuths.length === 0) return null;
                        return (
                          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: 'var(--color-bg-light)' }}>
                            {matchedCats.map(cat => (
                              <div
                                key={cat}
                                onClick={() => {
                                  router.push(`/books?category=${encodeURIComponent(cat)}`);
                                  setSearchQuery('');
                                  setShowSuggestions(false);
                                }}
                                style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}
                              >
                                Filter by Category: <strong>{cat}</strong>
                              </div>
                            ))}
                            {matchedAuths.map(auth => (
                              <div
                                key={auth}
                                onClick={() => {
                                  router.push(`/books?query=${encodeURIComponent(auth)}`);
                                  setSearchQuery('');
                                  setShowSuggestions(false);
                                }}
                                style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}
                              >
                                Books by Author: <strong>{auth}</strong>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      <div className={styles.suggestionList}>
                        {suggestions.map((book, idx) => (
                          <div
                            key={book.id}
                            className={styles.suggestionItem}
                            onClick={() => handleSuggestionClick(book.id)}
                            style={{
                              backgroundColor: idx === activeIndex ? 'var(--color-primary-light)' : undefined,
                            }}
                          >
                            <img src={book.image} alt={book.title} className={styles.suggestionThumb} />
                            <div className={styles.suggestionInfo}>
                              <h4 className={styles.suggestionTitle}>{highlightMatch(book.title, searchQuery)}</h4>
                              <p className={styles.suggestionMeta}>
                                By {highlightMatch(book.author, searchQuery)} | <span className={styles.suggestionCat}>{book.category}</span>
                              </p>
                              <span className={styles.suggestionPrice}>₹{book.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link 
                        href={`/books?query=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          saveToHistory(searchQuery);
                          setShowSuggestions(false);
                        }}
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

            {/* Actions */}
            <div className={styles.navActions}>
              <Link href="/admin" className={styles.adminIconBtn} title="Staff Login">
                <BookOpen size={20} />
              </Link>

              <Link href="/cart" className={styles.cartIconContainer}>
                <ShoppingBag size={20} className={styles.cartIcon} />
                {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Row 2: Secondary Desktop Menu Links */}
          <div className={styles.navbarSecondRow}>
            <nav className={styles.navMenu}>
              <Link href="/" className={styles.navLink}>Home</Link>
              <Link href="/books?category=Competitive%20Exams" className={styles.navLink}>Competitive Exams</Link>
              <Link href="/books?category=Academic%20Textbooks" className={styles.navLink}>Academic Textbooks</Link>
              <Link href="/books?category=Stationery" className={styles.navLink}>Stationery Store</Link>
              <Link href="/books?category=Used%20Books" className={styles.navLink}>Used Books</Link>
              <Link href="/contact" className={styles.navLink}>Support</Link>
              <Link href="/admin" className={styles.navLink}>Admin Portal</Link>
            </nav>
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
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Support & Contact</Link>
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>Admin Dashboard</Link>
          </nav>
        </div>
      )}
      {/* Floating Compare Tray */}
      {compareItems.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '88px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid var(--color-primary-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-premium)',
          padding: '16px 20px',
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitCompare size={16} /> Compare list ({compareItems.length}/3)
            </span>
            <button onClick={handleClearAllCompare} style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-error)' }}>Clear All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {compareItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={item.image} alt={item.title} style={{ width: '28px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-main)', fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textHighlight: 'ellipsis', textOverflow: 'ellipsis' }}>
                  {item.title}
                </span>
                <button onClick={() => handleRemoveCompareItem(item.id)} style={{ color: 'var(--color-text-light)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button 
              onClick={() => setIsCompareModalOpen(true)}
              style={{
                flex: 1,
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Compare Specs
            </button>
          </div>
        </div>
      )}

      {/* Global Compare Modal */}
      {isCompareModalOpen && compareItems.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitCompare size={20} /> Compare Book Specifications
              </h3>
              <button onClick={() => setIsCompareModalOpen(false)} style={{ color: '#ffffff', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 10px', color: 'var(--color-text-muted)', width: '25%' }}>Specification</th>
                    {compareItems.map(item => (
                      <th key={item.id} style={{ padding: '12px 10px', color: 'var(--color-primary)', fontWeight: 700 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                          <img src={item.image} alt={item.title} style={{ width: '40px', height: '56px', borderRadius: '4px', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} />
                          <span style={{ fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4em' }}>{item.title}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>Selling Price</td>
                    {compareItems.map(item => (
                      <td key={item.id} style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem' }}>₹{item.price}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>Original Price</td>
                    {compareItems.map(item => (
                      <td key={item.id} style={{ padding: '12px 10px', color: 'var(--color-text-light)' }}>
                        {item.originalPrice ? `₹${item.originalPrice}` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>Format / Binding</td>
                    {compareItems.map(item => (
                      <td key={item.id} style={{ padding: '12px 10px' }}>{item.format}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>Author</td>
                    {compareItems.map(item => (
                      <td key={item.id} style={{ padding: '12px 10px', fontWeight: 600 }}>{item.author}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>Category</td>
                    {compareItems.map(item => (
                      <td key={item.id} style={{ padding: '12px 10px' }}>{item.category}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>Publisher</td>
                    {compareItems.map(item => (
                      <td key={item.id} style={{ padding: '12px 10px' }}>{item.publisher || 'Official Print'}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>Rating</td>
                    {compareItems.map(item => (
                      <td key={item.id} style={{ padding: '12px 10px' }}>{item.rating} ★ ({item.reviewCount})</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', textAlign: 'right', backgroundColor: 'var(--color-bg-light)' }}>
              <button onClick={() => setIsCompareModalOpen(false)} className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 24px' }}>
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

