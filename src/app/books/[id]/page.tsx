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
import styles from './details.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
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

  // Load related items (same category, excluding current product)
  const products = getProducts();
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Companion product for specs comparison (first related item)
  const companion = relatedProducts[0];

  // Mock specifications
  const specs = {
    language: product.category === 'Novels & Literature' ? 'English' : 'English & Hindi (Bilingual)',
    binding: product.format || 'Paperback',
    weight: product.category === 'Stationery' ? '250g' : '520g',
    dimensions: product.category === 'Stationery' ? '15 x 8 x 2 cm' : '24 x 16 x 4 cm',
    edition: '2026 Edition (Latest syllabus)',
    publisher: product.publisher || 'Official Print'
  };

  // Mock highlights
  const highlights = [
    '100% genuine printed copy sourced directly from authorized publications.',
    'Comprehensive syllabus coverage with topic-wise explanation chapters.',
    'Includes previous years solved question papers and model mock tests.',
    'High-quality binding and white paper format optimized for revision notes.'
  ];

  // Mock Q&As
  const qnas = [
    {
      q: 'Is this edition updated for the upcoming 2026 exams?',
      a: 'Yes, this is the latest 2026 revised edition containing the newly implemented syllabus changes and updated current affairs questions.'
    },
    {
      q: 'Does it contain detailed explanations for the solved papers?',
      a: 'Yes, step-by-step reasoning and conceptual hints are provided at the end of each question paper section.'
    }
  ];

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
              <div className={styles.imageContainer}>
                <img src={product.image} alt={product.title} className={styles.image} />
              </div>
              
              {/* look inside pages link */}
              <div style={{ textAlign: 'center' }}>
                <PreviewModal />
              </div>

              {/* Multiple thumbnails */}
              <div className={styles.thumbnailGrid}>
                <img src={product.image} alt="Thumbnail 1" className={styles.thumbnail} />
                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=60" alt="Thumbnail 2" className={styles.thumbnail} />
                <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&auto=format&fit=crop&q=60" alt="Thumbnail 3" className={styles.thumbnail} />
              </div>

              {/* Action buttons (Wishlist & Compare) */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
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
                  {product.rating} stars ({product.reviewCount} customer reviews)
                </span>
              </div>

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
                <AddToCartButton product={product} />
              </div>

              {/* Delivery info card */}
              <div className={styles.deliveryNoteCard}>
                <Truck size={24} className={styles.deliveryIcon} />
                <div>
                  <h4 className={styles.deliveryTitle}>Indore Student Delivery Express ⚡</h4>
                  <p className={styles.deliveryText}>
                    Free delivery to Bhanwarkuan, Geeta Bhawan, Navlakha, and nearby student hostels/coaching centers on orders above ₹499. Pay on Delivery (UPI/COD) supported.
                  </p>
                </div>
              </div>

              {/* Highlights block */}
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>Key Highlights</h3>
                <ul className={styles.highlightsList}>
                  {highlights.map((hl, index) => (
                    <li key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '3px' }} />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description & Specifications Table */}
              <div className={styles.specsSection}>
                <h3 className={styles.specsTitle}>Description</h3>
                <p className={styles.description}>{product.description}</p>

                <h3 className={styles.specsTitle} style={{ marginTop: '24px' }}>Specifications</h3>
                <table className={styles.specsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.specLabel}>ISBN / Catalog Code</td>
                      <td className={styles.specValue}>{product.isbn || 'N/A'}</td>
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
                      <td className={styles.specLabel}>Language</td>
                      <td className={styles.specValue}>{specs.language}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Binding Format</td>
                      <td className={styles.specValue}>{specs.binding}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Page Count</td>
                      <td className={styles.specValue}>{product.pages ? `${product.pages} Pages` : 'N/A'}</td>
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
                        {product.inStock ? `In Stock (Only ${product.stockCount} left)` : 'Out of Stock'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Frequently Bought Together Bundle */}
              <FrequentlyBoughtTogether currentProduct={product} />

              {/* Questions & Answers Section */}
              <div className={styles.qnaSection}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '16px' }}>
                  Customer Questions & Answers
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {qnas.map((qna, idx) => (
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
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map((p) => (
                  <BookCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* 30. Recently Viewed Slider */}
          <RecentlyViewed currentProductId={product.id} allProducts={products} />

        </div>
      </section>

      <Footer />
    </div>
  );
}
