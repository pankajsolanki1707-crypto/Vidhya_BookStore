import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BookCard from '@/components/BookCard/BookCard';
import FilterSidebar from '@/components/FilterSidebar/FilterSidebar';
import { searchProducts } from '@/lib/database';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import styles from './books.module.css';

interface PageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    format?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  
  const query = resolvedSearchParams.query || '';
  const category = resolvedSearchParams.category || 'All';
  const format = resolvedSearchParams.format || 'All';
  const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;
  const sort = resolvedSearchParams.sort || 'rating';
  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const limit = 12;

  // Search catalog
  const { products, total, totalPages } = searchProducts({
    query,
    category,
    format,
    minPrice,
    maxPrice,
    sort,
    page,
    limit
  });

  // Calculate product index ranges
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Pagination URL helper
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (category !== 'All') params.set('category', category);
    if (format !== 'All') params.set('format', format);
    if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
    if (sort !== 'rating') params.set('sort', sort);
    params.set('page', pageNumber.toString());
    return `/books?${params.toString()}`;
  };

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.shopSection}>
        <div className="container">
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={14} />
            <span className={styles.breadcrumbCurrent}>Shop Catalog</span>
          </div>

          {/* Shop Core Layout */}
          <div className={styles.shopLayout}>
            {/* Sidebar */}
            <div className={styles.sidebarContainer}>
              <FilterSidebar
                currentCategory={category}
                currentFormat={format}
                currentSort={sort}
                currentQuery={query}
              />
            </div>

            {/* Main Products Area */}
            <div className={styles.productsArea}>
              {/* Header Info */}
              <div className={styles.resultsHeader}>
                <div className={styles.resultsCount}>
                  {total > 0 ? (
                    <span>
                      Showing <strong>{startItem}-{endItem}</strong> of <strong>{total}</strong> products
                    </span>
                  ) : (
                    <span>No products found</span>
                  )}
                </div>
              </div>

              {/* Grid of Cards */}
              {products.length > 0 ? (
                <>
                  <div className={styles.productsGrid}>
                    {products.map((product) => (
                      <BookCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <Link
                        href={getPageUrl(page - 1)}
                        className={`${styles.pageBtn} ${page <= 1 ? styles.disabled : ''}`}
                        aria-disabled={page <= 1}
                        style={page <= 1 ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                      >
                        Prev
                      </Link>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <Link
                            key={pageNum}
                            href={getPageUrl(pageNum)}
                            className={page === pageNum ? styles.activePageBtn : styles.pageBtn}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}

                      <Link
                        href={getPageUrl(page + 1)}
                        className={`${styles.pageBtn} ${page >= totalPages ? styles.disabled : ''}`}
                        aria-disabled={page >= totalPages}
                        style={page >= totalPages ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                      >
                        Next
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <h3 className={styles.emptyTitle}>No matching items found</h3>
                  <p className={styles.emptyText}>
                    We couldn't find any books or stationery that match your search filters. Try adjusting your sidebar selections or resetting filters.
                  </p>
                  <Link href="/books" className="btn-primary" style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} />
                    <span>Reset All Filters</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
