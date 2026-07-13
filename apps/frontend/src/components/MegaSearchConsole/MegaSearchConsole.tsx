'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Mic, MicOff, History, Sparkles } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/home.module.css';

export default function MegaSearchConsole() {
  const router = useRouter();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const consoleRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vbs_search_history');
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading history:', e);
    }
  }, []);

  // Debounced search suggestions fetch
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const catFilter = category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
        const res = await fetch(`/api/products?query=${encodeURIComponent(query)}${catFilter}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
          setActiveIndex(-1); // Reset index on new search
        }
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query, category]);

  // Click outside listener to hide search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (consoleRef.current && !consoleRef.current.contains(event.target as Node)) {
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

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    try {
      localStorage.removeItem('vbs_search_history');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToHistory(query);
      const catParam = category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
      router.push(`/books?query=${encodeURIComponent(query)}${catParam}`);
      setShowSuggestions(false);
    }
  };

  const handleTagClick = (tagQuery: string, tagCat = 'All') => {
    setQuery(tagQuery);
    setCategory(tagCat);
    saveToHistory(tagQuery);
    const catParam = tagCat !== 'All' ? `&category=${encodeURIComponent(tagCat)}` : '';
    router.push(`/books?query=${encodeURIComponent(tagQuery)}${catParam}`);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[activeIndex];
        router.push(`/books/${selected.id}`);
        setQuery('');
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
    recognition.lang = 'en-IN'; // Indian Accent English
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      saveToHistory(transcript);
      const catParam = category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
      router.push(`/books?query=${encodeURIComponent(transcript)}${catParam}`);
    };
    recognition.onerror = (err: any) => {
      console.error("Voice recognition error:", err);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className={styles.megaSearchContainer} ref={consoleRef}>
      <form onSubmit={handleSearchSubmit} className={styles.megaSearchForm}>
        {/* Category selector */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.megaSearchSelect}
        >
          <option value="All">All Categories</option>
          <option value="Competitive Exams">Competitive Exams</option>
          <option value="Academic Textbooks">Academic Textbooks</option>
          <option value="Novels & Literature">Novels & Literature</option>
          <option value="Stationery">Stationery Store</option>
          <option value="Used Books">Used Books</option>
        </select>

        {/* Text input */}
        <input
          type="text"
          placeholder="Search by Title, Author, ISBN, publisher, UPSC, DAVV exam codes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className={styles.megaSearchInput}
        />

        {/* Voice Search Button */}
        <button 
          type="button" 
          onClick={startVoiceSearch} 
          className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
          title="Voice Search"
        >
          {isListening ? <MicOff size={16} className={styles.pulseIcon} /> : <Mic size={16} />}
        </button>

        {/* Action Button */}
        <button type="submit" className={styles.megaSearchBtn}>
          <Search size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showSuggestions && (
        <div className={styles.suggestionsDropdown}>
          {/* Recent Searches Header */}
          {query.trim() === '' && searchHistory.length > 0 && (
            <div className={styles.historySection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}><History size={13} style={{ marginRight: '6px' }} /> Recent Searches</span>
                <button type="button" onClick={clearHistory} className={styles.clearHistoryBtn}>Clear All</button>
              </div>
              <div className={styles.historyList}>
                {searchHistory.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleTagClick(item)} 
                    className={styles.historyItem}
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions List */}
          {query.trim() !== '' && (
            <>
              {isSearching ? (
                <div className={styles.searchState}>
                  <Loader2 size={16} className="animate-spin" style={{ display: 'inline', marginRight: '8px' }} />
                  Searching database...
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className={styles.suggestionsList}>
                    {suggestions.map((book, idx) => (
                      <div
                        key={book.id}
                        onClick={() => {
                          router.push(`/books/${book.id}`);
                          setQuery('');
                          setShowSuggestions(false);
                        }}
                        style={{
                          backgroundColor: idx === activeIndex ? 'var(--color-primary-light)' : undefined,
                        }}
                        className={styles.suggestionRow}
                      >
                        <img src={book.image} alt={book.title} className={styles.suggestionCover} />
                        <div className={styles.suggestionText}>
                          <h4 className={styles.suggestionTitleText}>{book.title}</h4>
                          <p className={styles.suggestionMetaText}>
                            By <span className={styles.boldText}>{book.author}</span> 
                            {book.publisher && <> | {book.publisher}</>}
                            {book.isbn && <> | ISBN: {book.isbn}</>}
                          </p>
                          <span className={styles.suggestionBadge}>{book.category}</span>
                        </div>
                        <div className={styles.suggestionPriceContainer}>
                          <span className={styles.suggestionPrice}>₹{book.price}</span>
                          {book.originalPrice && book.originalPrice > book.price && (
                            <span className={styles.suggestionOriginalPrice}>₹{book.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link 
                    href={`/books?query=${encodeURIComponent(query)}${category !== 'All' ? `&category=${encodeURIComponent(category)}` : ''}`}
                    onClick={() => setShowSuggestions(false)}
                    className={styles.viewAllResultBtn}
                  >
                    View all results for "{query}"
                  </Link>
                </>
              ) : (
                <div className={styles.searchState}>
                  No books or stationery matches found.
                </div>
              )}
            </>
          )}

          {/* Popular searches suggestions */}
          {query.trim() === '' && (
            <div className={styles.popularSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}><Sparkles size={13} style={{ marginRight: '6px' }} /> Popular Searches</span>
              </div>
              <div className={styles.popularList}>
                <button onClick={() => handleTagClick('MPPSC Prelims', 'Competitive Exams')} className={styles.popularItem}>🦁 MPPSC Complete GS Kit</button>
                <button onClick={() => handleTagClick('Polity', 'Competitive Exams')} className={styles.popularItem}>🏛️ UPSC Laxmikanth 7th Ed</button>
                <button onClick={() => handleTagClick('Used', 'Used Books')} className={styles.popularItem}>🔄 Second Hand Books</button>
                <button onClick={() => handleTagClick('Casio', 'Stationery')} className={styles.popularItem}>🧮 Casio Scientific Calculator</button>
                <button onClick={() => handleTagClick('Novel', 'Novels & Literature')} className={styles.popularItem}>📚 Best Seller Novels</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trending Search Shortcuts */}
      <div className={styles.trendingTags}>
        <strong>Trending:</strong>
        <button onClick={() => handleTagClick('MPPSC Prelims', 'Competitive Exams')} className={styles.tagLink}>MPPSC GS Kit</button>
        <button onClick={() => handleTagClick('Polity', 'Competitive Exams')} className={styles.tagLink}>UPSC Polity</button>
        <button onClick={() => handleTagClick('Casio', 'Stationery')} className={styles.tagLink}>Scientific Calculator</button>
        <button onClick={() => handleTagClick('Atomic Habits', 'Novels & Literature')} className={styles.tagLink}>Atomic Habits</button>
        <button onClick={() => handleTagClick('Laxmikanth', 'Used Books')} className={styles.tagLink}>Used Laxmikanth</button>
      </div>
    </div>
  );
}
