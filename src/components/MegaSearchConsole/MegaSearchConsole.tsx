'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/home.module.css';

export default function MegaSearchConsole() {
  const router = useRouter();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const consoleRef = useRef<HTMLDivElement>(null);

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
        const res = await fetch(`/api/products?query=${encodeURIComponent(query)}${catFilter}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const catParam = category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
      router.push(`/books?query=${encodeURIComponent(query)}${catParam}`);
      setShowSuggestions(false);
    }
  };

  const handleTagClick = (tagQuery: string, tagCat = 'All') => {
    setQuery(tagQuery);
    setCategory(tagCat);
    const catParam = tagCat !== 'All' ? `&category=${encodeURIComponent(tagCat)}` : '';
    router.push(`/books?query=${encodeURIComponent(tagQuery)}${catParam}`);
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
          placeholder="Search by Title, Author, ISBN, UPSC syllabus, DAVV semesters, registers..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className={styles.megaSearchInput}
        />

        {/* Action Button */}
        <button type="submit" className={styles.megaSearchBtn}>
          <Search size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showSuggestions && (query.trim() !== '') && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: '24px',
            right: '24px',
            marginTop: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-hover)',
            overflow: 'hidden',
            zIndex: 110,
          }}
        >
          {isSearching ? (
            <div style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader2 size={16} className="animate-spin" />
              Searching catalog databases...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div>
                {suggestions.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      router.push(`/books/${book.id}`);
                      setQuery('');
                      setShowSuggestions(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--color-bg-light)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                    className="suggestion-row"
                  >
                    <img src={book.image} alt={book.title} style={{ width: '36px', height: '48px', borderRadius: '4px', boxShadow: 'var(--shadow-sm)' }} />
                    <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                        {book.title}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                        By {book.author} | <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{book.format}</span>
                      </p>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)' }}>₹{book.price}</span>
                  </div>
                ))}
              </div>
              <Link 
                href={`/books?query=${encodeURIComponent(query)}${category !== 'All' ? `&category=${encodeURIComponent(category)}` : ''}`}
                onClick={() => setShowSuggestions(false)}
                style={{
                  display: 'block',
                  padding: '12px',
                  backgroundColor: 'var(--color-bg-light)',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                View all search results
              </Link>
            </>
          ) : (
            <div style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              No books or stationery items found.
            </div>
          )}
        </div>
      )}

      {/* Trending Search Shortcuts */}
      <div className={styles.trendingTags}>
        <strong>Trending Searches:</strong>
        <button onClick={() => handleTagClick('MPPSC Prelims', 'Competitive Exams')} className={styles.tagLink}>MPPSC GS Kit</button>
        <button onClick={() => handleTagClick('Polity', 'Competitive Exams')} className={styles.tagLink}>UPSC Polity</button>
        <button onClick={() => handleTagClick('Casio', 'Stationery')} className={styles.tagLink}>Scientific Calculator</button>
        <button onClick={() => handleTagClick('Atomic Habits', 'Novels & Literature')} className={styles.tagLink}>Atomic Habits</button>
        <button onClick={() => handleTagClick('Laxmikanth', 'Used Books')} className={styles.tagLink}>Used Laxmikanth</button>
      </div>
    </div>
  );
}
