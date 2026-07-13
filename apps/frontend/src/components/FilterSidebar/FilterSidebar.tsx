'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  currentCategory?: string;
  currentFormat?: string;
  currentSort?: string;
  currentQuery?: string;
}

export default function FilterSidebar({
  currentCategory = 'All',
  currentFormat = 'All',
  currentSort = 'rating',
  currentQuery = ''
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  // Initialize prices from URL
  useEffect(() => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    if (min) setMinPrice(Number(min));
    if (max) setMaxPrice(Number(max));
  }, [searchParams]);

  // Categories list
  const categories = [
    { name: 'All Categories', value: 'All' },
    { name: 'Competitive Exams', value: 'Competitive Exams' },
    { name: 'Academic Textbooks', value: 'Academic Textbooks' },
    { name: 'Novels & Literature', value: 'Novels & Literature' },
    { name: 'Stationery Store', value: 'Stationery' }
  ];

  // Formats list
  const formats = [
    { name: 'All Formats', value: 'All' },
    { name: 'Paperback', value: 'Paperback' },
    { name: 'Hardcover', value: 'Hardcover' },
    { name: 'Stationery Item', value: 'Stationery' },
    { name: 'Bundle Kit', value: 'Bundle' }
  ];

  // Sorting options
  const sortOptions = [
    { name: 'Top Rated', value: 'rating' },
    { name: 'Price: Low to High', value: 'price-low' },
    { name: 'Price: High to Low', value: 'price-high' },
    { name: 'Newest Arrivals', value: 'newest' }
  ];

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'All') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset page on filter update
    params.delete('page');
    
    router.push(`/books?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', minPrice.toString());
    params.set('maxPrice', maxPrice.toString());
    params.delete('page');
    router.push(`/books?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(2000);
    router.push('/books');
  };

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Filter size={18} />
          <h3 className={styles.title}>Filter Products</h3>
        </div>
        <button onClick={handleResetFilters} className={styles.resetBtn} title="Reset all filters">
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Selected Query Alert */}
      {currentQuery && (
        <div className={styles.searchNotice}>
          <span>Searching: <strong>"{currentQuery}"</strong></span>
        </div>
      )}

      {/* Category Section */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>Category</h4>
        <div className={styles.optionsList}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilters('category', cat.value)}
              className={currentCategory.toLowerCase() === cat.value.toLowerCase() ? styles.activeOption : styles.optionBtn}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Format Section */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>Format</h4>
        <div className={styles.optionsList}>
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => updateFilters('format', f.value)}
              className={currentFormat.toLowerCase() === f.value.toLowerCase() ? styles.activeOption : styles.optionBtn}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>Price Range (₹)</h4>
        <form onSubmit={handlePriceApply} className={styles.priceForm}>
          <div className={styles.priceInputs}>
            <div className={styles.priceInputGroup}>
              <label>Min</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                className={styles.priceInput}
              />
            </div>
            <div className={styles.priceInputGroup}>
              <label>Max</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value)))}
                className={styles.priceInput}
              />
            </div>
          </div>
          <button type="submit" className={styles.priceBtn}>
            Apply Price
          </button>
        </form>
      </div>

      {/* Sorting Section */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>Sort By</h4>
        <div className={styles.sortingList}>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilters('sort', opt.value)}
              className={currentSort === opt.value ? styles.activeSortOption : styles.sortOptionBtn}
            >
              <ArrowUpDown size={12} />
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
