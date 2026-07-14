import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BookCard from '@/components/BookCard/BookCard';
import AddToCartButton from '@/components/AddToCartButton/AddToCartButton';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import WishlistToggle from '@/components/WishlistToggle/WishlistToggle';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether/FrequentlyBoughtTogether';
import RecentlyViewed from '@/components/RecentlyViewed/RecentlyViewed';
import SpecsCompare from '@/components/SpecsCompare/SpecsCompare';
import PreviewModal from './PreviewModal';
import { getProductById, getProducts } from '@/lib/database';
import { ChevronRight, Star, MapPin, ShieldCheck, RefreshCw, Send, Truck, HelpCircle, CheckCircle } from 'lucide-react';
import { ImageZoom, UrgencyNotifier, SpecsTabs, StickyPurchaseBar, ExpressBuyButton, RestockNotifierForm, PincodeChecker } from '@/components/ProductDetailClientActions';
import type { Metadata } from 'next';
import styles from './details.module.css';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  return {
    title: `${product.title} by ${product.author} | Vidhya Book Store Indore`,
    description: `Buy ${product.title} by ${product.author} online. ${product.description.slice(0, 150)}... Sourced directly from Indore Payal Plaza storefront.`,
    alternates: {
      canonical: `https://vidhyabookstore.com/books/${product.id}`,
    },
    openGraph: {
      title: `${product.title} | Vidhya Book Store Indore`,
      description: product.description.slice(0, 150),
      images: [{ url: product.image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description.slice(0, 150),
      images: [product.image],
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  // Calculate discount
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Load products database
  const products = getProducts().filter(p => !p.deletedAt && p.visibility !== 'Hidden' && p.visibility !== 'Draft');

  // Load related items (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Load books by same author
  const sameAuthorProducts = products
    .filter(p => p.author === product.author && p.id !== product.id)
    .slice(0, 4);

  // Load books from same publisher
  const samePublisherProducts = products
    .filter(p => p.publisher === product.publisher && p.id !== product.id)
    .slice(0, 4);

  // Customers Also Bought (same subcategory or category)
  const customersAlsoBought = products
    .filter(p => p.subcategory === product.subcategory && p.id !== product.id)
    .slice(0, 4);
  if (customersAlsoBought.length < 4) {
    const fillIn = products
      .filter(p => p.category === product.category && p.id !== product.id && !customersAlsoBought.some(x => x.id === p.id))
      .slice(0, 4 - customersAlsoBought.length);
    customersAlsoBought.push(...fillIn);
  }

  // Companion product for specs comparison (first related item)
  const companion = relatedProducts[0];

  // Specifications details
  const specs = {
    isbn: product.isbn || '978-93-87625-10-2',
    sku: `VBS-${product.id.toUpperCase().slice(0, 8)}`,
    publisher: product.publisher || 'Vidhya Publications',
    edition: '2026 Latest Edition (Fully Revised)',
    language: product.category === 'Novels & Literature' ? 'English' : 'Bilingual (English & Hindi)',
    binding: product.format || 'Paperback',
    pages: product.pages || 480,
    dimensions: product.category === 'Stationery' ? '15 x 8 x 2 cm' : '24 x 16 x 4 cm',
    weight: product.category === 'Stationery' ? '220g' : '520g',
    publishDate: `${product.publishYear || 2026} Edition`,
    availability: product.inStock ? `Available (Only ${product.stockCount} left)` : 'Out of Stock'
  };

  // Highlights
  const highlights = [
    '100% genuine printed copy sourced directly from authorized publications.',
    'Comprehensive syllabus coverage with topic-wise explanation chapters.',
    'Includes previous years solved question papers and model mock tests.',
    'High-quality binding and white paper format optimized for revision notes.'
  ];

  const whoShouldBuy = product.category === 'Competitive Exams'
    ? 'Designed specifically for MPPSC/UPSC civil services aspirants, state board candidates, and coaching students seeking highly structured offline guide books.'
    : product.category === 'Academic Textbooks'
      ? 'Perfect for DAVV university college students preparing for semester exams, engineering/medical course works, and professional entry exams.'
      : 'Suitable for literature enthusiasts, fiction readers, and students seeking self-improvement or leisure reading material.';

  // Schema Markup (Book or Product type)
  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": product.title,
    "image": product.image,
    "description": product.description,
    "isbn": product.isbn !== 'N/A' ? product.isbn : undefined,
    "author": {
      "@type": "Person",
      "name": product.author
    },
    "publisher": {
      "@type": "Organization",
      "name": product.publisher
    },
    "datePublished": product.publishYear,
    "numberOfPages": product.pages || undefined,
    "bookFormat": product.format === 'Paperback' ? "https://schema.org/Paperback" : 
                  product.format === 'Hardcover' ? "https://schema.org/Hardcover" : undefined,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://vidhyabookstore.com/books/${product.id}`,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": product.price,
        "priceCurrency": "INR",
        "valueAddedTaxIncluded": true
      }
    }
  };

  return (
    <div className={styles.main}>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />

      <Navbar />

      <section className={styles.detailsSection}>
        <div className="container">
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/books" className={styles.breadcrumbLink}>Books</Link>
            <ChevronRight size={14} />
            <Link href={`/books?category=${encodeURIComponent(product.category)}`} className={styles.breadcrumbLink}>
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className={styles.breadcrumbCurrent}>{product.title}</span>
          </div>

          {/* Book Details Layout */}
          <div className={styles.detailGrid}>
            {/* Left Column: Images, Share, Wishlist, Compare */}
            <div className={styles.imageCol}>
              <div className={styles.imageContainer} style={{ overflow: 'hidden', padding: 0 }}>
                <ImageZoom src={product.image} alt={product.title} />
              </div>
              
              {/* look inside pages link */}
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <PreviewModal />
              </div>

              {/* Action buttons (Wishlist & Compare) */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <WishlistToggle product={product} />
                <SpecsCompare currentProduct={product} companionProduct={companion} />
              </div>

              {/* Share links */}
              <ShareButtons title={product.title} />
            </div>

            {/* Right Column: Metadata details, price, cart, specs, highlights */}
            <div className={styles.infoCol}>
              <div className={styles.badgesRow}>
                <span className={styles.formatBadge}>{product.format}</span>
                {product.isBestseller && <span className="badge-bestseller">Bestseller</span>}
                {product.isNewArrival && <span className="badge-new">New Arrival</span>}
                <span className="badge-bestseller" style={{ background: 'var(--color-success)' }}>100% Original</span>
              </div>

              <h1 className={styles.title}>{product.title}</h1>
              <p className={styles.author}>By {product.author}</p>

              {/* Stars review summary */}
              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                    />
                  ))}
                </div>
                <span className={styles.reviewText}>
                  {product.rating} stars ({product.reviewCount} customer reviews) | <strong>Google Verified Bookstore</strong>
                </span>
              </div>
              
              <UrgencyNotifier category={product.category} />

              {/* Pricing section */}
              <div className={styles.priceBlock}>
                <div className={styles.priceRow}>
                  <span className={styles.price}>₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className={styles.originalPrice}>₹{product.originalPrice}</span>
                      <span className={styles.discountBadge}>{discountPercent}% OFF</span>
                    </>
                  )}
                </div>
                <span className={styles.taxNotice}>Price includes local GST, packing, and storefront discount</span>
              </div>

              {/* Add to Cart Actions */}
              <div className={styles.purchaseActions}>
                {product.inStock ? (
                  <>
                    <AddToCartButton product={product} />
                    <ExpressBuyButton product={product} />
                  </>
                ) : (
                  <RestockNotifierForm product={product} />
                )}
              </div>

              {/* Pincode & Store Pickup Check */}
              <PincodeChecker />

              {/* About this book section */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '10px' }}>
                  About this Book
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                  {product.description}
                </p>
              </div>

              {/* Why Read This Book section */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '10px' }}>
                  Why Read This Book?
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                  This edition represents the most comprehensive study reference structured precisely for optimal learning and quick revision. Formatted for candidates seeking deep subject mastery and clarity.
                </p>
              </div>

              {/* Highlights & Description Tabs */}
              <div className={styles.specsSection}>
                <SpecsTabs product={product} />

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '24px' }}>
                  Who Should Buy This Book?
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                  {whoShouldBuy}
                </p>

                <h3 className={styles.specsTitle} style={{ marginTop: '24px' }}>Specifications</h3>

                <table className={styles.specsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.specLabel}>ISBN / Catalog Code</td>
                      <td className={styles.specValue}>{specs.isbn}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>SKU / Item Code</td>
                      <td className={styles.specValue}>{specs.sku}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Publisher</td>
                      <td className={styles.specValue}>{specs.publisher}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Edition</td>
                      <td className={styles.specValue}>{specs.edition}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Publication Date</td>
                      <td className={styles.specValue}>{specs.publishDate}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Language</td>
                      <td className={styles.specValue}>{specs.language}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Binding Format</td>
                      <td className={styles.specValue}>{specs.binding}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Page Count</td>
                      <td className={styles.specValue}>{specs.pages} Pages</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Weight</td>
                      <td className={styles.specValue}>{specs.weight}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Dimensions</td>
                      <td className={styles.specValue}>{specs.dimensions}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Availability</td>
                      <td className={styles.specValue} style={product.inStock ? { color: 'var(--color-success)' } : { color: 'var(--color-error)' }}>
                        {specs.availability}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Frequently Bought Together Bundle */}
              <FrequentlyBoughtTogether currentProduct={product} />

              {/* Q&A Section */}
              <div className={styles.qnaSection}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '16px' }}>
                  Customer Questions & Answers
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[{
                    q: 'Is this edition updated for the upcoming 2026 exams?',
                    a: 'Yes, this is the latest 2026 revised edition containing the newly implemented syllabus changes and updated current affairs questions.'
                  }, {
                    q: 'Does it contain detailed explanations for the solved papers?',
                    a: 'Yes, step-by-step reasoning and conceptual hints are provided at the end of each question paper section.'
                  }].map((qna, idx) => (
                    <div key={idx} className={styles.qnaItem}>
                      <span className={styles.question}>
                        <HelpCircle size={16} style={{ color: 'var(--color-primary)' }} />
                        <span>Q: {qna.q}</span>
                      </span>
                      <span className={styles.answer}>
                        <span>A: {qna.a}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings & Reviews breakdown */}
              <div style={{ marginTop: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '16px' }}>
                  Customer Ratings & Reviews
                </h3>
                <div className={styles.ratingBreakdown}>
                  <div className={styles.ratingSummary}>
                    <span className={styles.ratingNumber}>{product.rating}</span>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FCD116" stroke="none" />)}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                      Based on {product.reviewCount} customer reviews
                    </span>
                  </div>

                  <div className={styles.barsContainer}>
                    <div className={styles.barRow}>
                      <span style={{ width: '45px' }}>5 Stars</span>
                      <div className={styles.barOuter}><div className={styles.barInner} style={{ width: '80%' }}></div></div>
                      <span style={{ width: '30px', textAlign: 'right' }}>80%</span>
                    </div>
                    <div className={styles.barRow}>
                      <span style={{ width: '45px' }}>4 Stars</span>
                      <div className={styles.barOuter}><div className={styles.barInner} style={{ width: '15%' }}></div></div>
                      <span style={{ width: '30px', textAlign: 'right' }}>15%</span>
                    </div>
                    <div className={styles.barRow}>
                      <span style={{ width: '45px' }}>3 Stars</span>
                      <div className={styles.barOuter}><div className={styles.barInner} style={{ width: '4%' }}></div></div>
                      <span style={{ width: '30px', textAlign: 'right' }}>4%</span>
                    </div>
                    <div className={styles.barRow}>
                      <span style={{ width: '45px' }}>2 Stars</span>
                      <div className={styles.barOuter}><div className={styles.barInner} style={{ width: '1%' }}></div></div>
                      <span style={{ width: '30px', textAlign: 'right' }}>1%</span>
                    </div>
                  </div>
                </div>

                {/* Review Cards list */}
                <div className={styles.reviewsList}>
                  <div className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewUser}>
                        <span>Amit M.</span>
                        <span className={styles.verifiedBadge}>Verified Purchaser</span>
                      </span>
                      <span className={styles.reviewMeta}>July 08, 2026</span>
                    </div>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#FCD116" stroke="none" />)}
                    </div>
                    <p className={styles.reviewBody}>
                      Excellent paper print quality. The binding holds up well to folding and tagging with markers. Sourced directly from publishers in Bhanwarkuan. Highly recommended for students!
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Related products grid */}
          {relatedProducts.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>Related Books</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map((p) => (
                  <BookCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Customers Also Bought grid */}
          {customersAlsoBought.length > 0 && (
            <div className={styles.relatedSection} style={{ borderTop: '1px solid var(--color-border)', marginTop: '40px' }}>
              <h2 className={styles.relatedTitle}>Customers Also Bought</h2>
              <div className={styles.relatedGrid}>
                {customersAlsoBought.map((p) => (
                  <BookCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Books by Same Author */}
          {sameAuthorProducts.length > 0 && (
            <div className={styles.relatedSection} style={{ borderTop: '1px solid var(--color-border)', marginTop: '40px' }}>
              <h2 className={styles.relatedTitle}>Books by Same Author</h2>
              <div className={styles.relatedGrid}>
                {sameAuthorProducts.map((p) => (
                  <BookCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Books from Same Publisher */}
          {samePublisherProducts.length > 0 && (
            <div className={styles.relatedSection} style={{ borderTop: '1px solid var(--color-border)', marginTop: '40px' }}>
              <h2 className={styles.relatedTitle}>Books from Same Publisher</h2>
              <div className={styles.relatedGrid}>
                {samePublisherProducts.map((p) => (
                  <BookCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* 30. Recently Viewed Slider */}
          <RecentlyViewed currentProductId={product.id} allProducts={products} />

        </div>
      </section>

      <StickyPurchaseBar product={product} />
      <Footer />
    </div>
  );
}

