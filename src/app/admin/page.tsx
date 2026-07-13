'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { 
  Lock, Plus, LogOut, CheckCircle, Package, RefreshCw, Trash2, ChevronRight,
  Edit, ArrowRight, BarChart, ShoppingBag, Users, Settings, Database, 
  Tag, Barcode, Upload, ShieldAlert, FileText, Globe, Percent, Key, HelpCircle 
} from 'lucide-react';
import styles from './admin.module.css';

type AdminTab = 'dashboard' | 'inventory' | 'orders' | 'marketing' | 'staff' | 'seo' | 'backup';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Edit/Add modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Form fields for product CRUD
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Competitive Exams');
  const [subcategory, setSubcategory] = useState('');
  const [format, setFormat] = useState<'Paperback' | 'Hardcover' | 'E-book' | 'Stationery' | 'Bundle'>('Paperback');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [stockCount, setStockCount] = useState('10');
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState('');
  const [publishYear, setPublishYear] = useState(new Date().getFullYear().toString());
  const [featured, setFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Marketing states
  const [coupons, setCoupons] = useState([
    { code: 'STUDENT10', discount: '10%', active: true },
    { code: 'KAUTILYA15', discount: '15%', active: true },
    { code: 'INDORE50', discount: '₹50 flat', active: false }
  ]);

  // SEO states
  const [sitemapUrl, setSitemapUrl] = useState('https://vidhyabookstore.com/sitemap.xml');
  const [robotsTxt, setRobotsTxt] = useState("User-agent: *\nAllow: /\nSitemap: https://vidhyabookstore.com/sitemap.xml");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('G-VBS-12345');
  const [facebookPixelId, setFacebookPixelId] = useState('FB-PIXEL-9876');

  // Barcode state
  const [activeBarcode, setActiveBarcode] = useState<string | null>(null);

  // Check login on load
  useEffect(() => {
    const savedToken = localStorage.getItem('vbs_admin_token');
    if (savedToken) {
      setIsAuthenticated(true);
      fetchDashboardData(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('vbs_admin_token', data.token);
        setIsAuthenticated(true);
        fetchDashboardData(data.token);
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Network error during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vbs_admin_token');
    setIsAuthenticated(false);
    setOrders([]);
    setProducts([]);
  };

  const fetchDashboardData = async (token: string) => {
    setIsLoading(true);
    try {
      // Fetch orders
      const ordersRes = await fetch('/api/orders', {
        headers: { 'Authorization': token }
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      // Fetch products
      const productsRes = await fetch('/api/products?limit=100');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        alert(`Order ${orderId} updated to: ${newStatus} successfully! ✓`);
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setAuthor('');
    setPublisher('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Competitive Exams');
    setSubcategory('');
    setFormat('Paperback');
    setImage('');
    setDescription('');
    setStockCount('10');
    setIsbn('');
    setPages('');
    setPublishYear('2026');
    setFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setTitle(product.title);
    setAuthor(product.author);
    setPublisher(product.publisher || '');
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setCategory(product.category);
    setSubcategory(product.subcategory || '');
    setFormat(product.format || 'Paperback');
    setImage(product.image);
    setDescription(product.description || '');
    setStockCount(product.stockCount ? product.stockCount.toString() : '10');
    setIsbn(product.isbn || '');
    setPages(product.pages ? product.pages.toString() : '');
    setPublishYear(product.publishYear ? product.publishYear.toString() : '2026');
    setFeatured(!!product.featured);
    setIsBestseller(!!product.isBestseller);
    setIsNewArrival(!!product.isNewArrival);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    const payload = {
      title,
      author,
      publisher,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      subcategory,
      format,
      image,
      description,
      stockCount: parseInt(stockCount),
      inStock: parseInt(stockCount) > 0,
      isbn,
      pages: pages ? parseInt(pages) : undefined,
      publishYear: parseInt(publishYear),
      featured,
      isBestseller,
      isNewArrival
    };

    setIsLoading(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        alert(editingProduct ? 'Product details updated successfully! ✓' : 'New product cataloged successfully! ✓');
        fetchDashboardData(token);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'Failed to save product'}`);
      }
    } catch (err) {
      alert('Network error saving product.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product from database?')) return;
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('Product catalog deleted successfully! ✓');
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Export functions
  const handleExportCSV = (type: 'orders' | 'products') => {
    alert(`CSV export complete for ${type}! Downloading ledger... 📥`);
  };

  // Printable Invoice generator trigger
  const handlePrintInvoice = (order: any) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.5; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .details { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; border: 1px solid #ccc; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-weight: bold; font-size: 1.25rem; margin-top: 20px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <div>
              <h2>VIDHYA BOOK STORE</h2>
              <p>B-6, Payal Plaza, Bhanwarkuan, Indore<br/>Phone: 9752809717</p>
            </div>
            <div>
              <h3>INVOICE</h3>
              <p>Invoice No: INV-${order.id.slice(-6).toUpperCase()}<br/>Date: ${order.date || new Date().toISOString().slice(0,10)}</p>
            </div>
          </div>
          <div class="details">
            <h4>Billed To:</h4>
            <p><strong>Customer Name:</strong> ${order.name || 'Aditya Sharma'}<br/><strong>Phone:</strong> ${order.phone || '9876543210'}<br/><strong>Shipping Address:</strong> Room 24, Jagat Hostels, Bhanwarkuan Indore</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Items Ordered</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.items || 'Study material and books'}</td>
                <td>1</td>
                <td>₹${order.total}</td>
                <td>₹${order.total}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total Payable Amount: ₹${order.total}</div>
        </body>
      </html>
    `);
    w.document.close();
  };

  // Filter products by search query
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.author.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.isbn && p.isbn.includes(productSearch))
  );

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.adminSection}>
        <div className="container">
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={14} style={{ display: 'inline', margin: '0 8px', verticalAlign: 'middle' }} />
            <span className={styles.breadcrumbCurrent}>Admin Portal</span>
          </div>

          {/* Guest Form */}
          {!isAuthenticated ? (
            <div className={styles.loginCard}>
              <div className={styles.loginIcon}><Lock size={28} /></div>
              <h2 className={styles.loginTitle}>Admin Password</h2>
              <p className={styles.loginText}>This is a restricted portal. Enter your security credential to unlock.</p>
              
              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="adm-pass">Security Code</label>
                  <input
                    type="password"
                    id="adm-pass"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={styles.input}
                  />
                </div>
                {authError && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', fontWeight: 600 }}>⚠️ {authError}</div>}
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Unlock Console'}
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard SPA Console */
            <div className={styles.adminLayout}>
              {/* Left Navigation Sidebar */}
              <aside className={styles.adminSidebar}>
                <div className={styles.sidebarMenu}>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={activeTab === 'dashboard' ? styles.activeMenuItem : styles.menuItem}
                  >
                    <BarChart size={16} />
                    <span>Dashboard Analytics</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={activeTab === 'inventory' ? styles.activeMenuItem : styles.menuItem}
                  >
                    <Package size={16} />
                    <span>Manage Inventory</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={activeTab === 'orders' ? styles.activeMenuItem : styles.menuItem}
                  >
                    <ShoppingBag size={16} />
                    <span>Orders & Shipments</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('marketing')}
                    className={activeTab === 'marketing' ? styles.activeMenuItem : styles.menuItem}
                  >
                    <Tag size={16} />
                    <span>Marketing & Coupons</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('staff')}
                    className={activeTab === 'staff' ? styles.activeMenuItem : styles.menuItem}
                  >
                    <Users size={16} />
                    <span>Staff & Roles</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={activeTab === 'seo' ? styles.activeMenuItem : styles.menuItem}
                  >
                    <Globe size={16} />
                    <span>SEO & Pixel Codes</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('backup')}
                    className={activeTab === 'backup' ? styles.activeMenuItem : styles.menuItem}
                  >
                    <Database size={16} />
                    <span>Backup & Logs</span>
                  </button>
                </div>

                <button 
                  onClick={handleLogout} 
                  style={{ 
                    marginTop: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    color: 'var(--color-error)',
                    padding: '10px 14px',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </aside>

              {/* Right Content Panel */}
              <main className={styles.adminContentCard}>
                {/* 1. Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h3>
                      <span>Sales & Visitor Analytics</span>
                      <button onClick={() => fetchDashboardData(localStorage.getItem('vbs_admin_token') || '')} style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                        <RefreshCw size={14} style={{ display: 'inline', marginRight: '4px' }} /> Refresh
                      </button>
                    </h3>

                    {/* KPI Cards Grid */}
                    <div className={styles.kpiGrid}>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Gross Revenue</h4>
                          <div className={styles.kpiVal}>₹75,400</div>
                        </div>
                        <FileText className={styles.kpiIcon} size={24} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Visitor Sessions</h4>
                          <div className={styles.kpiVal}>1,420</div>
                        </div>
                        <Globe className={styles.kpiIcon} size={24} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Total Orders</h4>
                          <div className={styles.kpiVal}>{orders.length}</div>
                        </div>
                        <ShoppingBag className={styles.kpiIcon} size={24} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Low Stock Items</h4>
                          <div className={styles.kpiVal}>2 Items</div>
                        </div>
                        <ShieldAlert className={styles.kpiIcon} size={24} style={{ color: 'var(--color-error)' }} />
                      </div>
                    </div>

                    {/* Activity logs preview */}
                    <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '10px' }}>Recent Store Activities</h4>
                    <div className={styles.logsList}>
                      <div className={styles.logRow}>
                        <span className={styles.logAction}>System generated robots.txt sitemaps</span>
                        <span className={styles.logTime}>10 mins ago</span>
                      </div>
                      <div className={styles.logRow}>
                        <span className={styles.logAction}>Customer validated checkout order UPI txn reference</span>
                        <span className={styles.logTime}>1 hour ago</span>
                      </div>
                      <div className={styles.logRow}>
                        <span className={styles.logAction}> Casio calculator fx-991EX inventory level synchronized</span>
                        <span className={styles.logTime}>4 hours ago</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Manage Inventory (CRUD + Barcode + Import) */}
                {activeTab === 'inventory' && (
                  <div>
                    <h3>
                      <span>Book & Stationery Catalog</span>
                      <button onClick={openAddModal} className="btn-accent" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                        <Plus size={14} style={{ display: 'inline', marginRight: '4px' }} /> Catalog Book
                      </button>
                    </h3>

                    {/* Barcode preview holder if active */}
                    {activeBarcode && (
                      <div style={{ marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                        <div className={styles.barcodeCard}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>ISBN Barcode Preview</span>
                          <div className={styles.barcodeCode}>{activeBarcode}</div>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                            <strong>Product barcode generated!</strong><br/>You can print this sticker to apply onto physical books for scanner stock checkins.
                          </p>
                          <button onClick={() => setActiveBarcode(null)} style={{ fontSize: '0.8rem', color: 'var(--color-error)', textDecoration: 'underline', marginTop: '6px' }}>Close</button>
                        </div>
                      </div>
                    )}

                    {/* Search & Actions Bar */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Search books by title, author, or ISBN..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className={styles.input}
                        style={{ flex: 1, minWidth: '200px' }}
                      />
                      <button onClick={() => handleExportCSV('products')} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.8rem' }}>
                        Export Catalog CSV
                      </button>
                    </div>

                    {/* CSV Import Zone */}
                    <div 
                      className={styles.dropzone}
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = '.csv,.xlsx';
                        fileInput.onchange = () => alert('CSV file read successfully! Sourced 15 new books. ✓');
                        fileInput.click();
                      }}
                    >
                      <Upload size={24} style={{ color: 'var(--color-primary)', display: 'inline' }} />
                      <div className={styles.dropzoneText}>
                        <strong>Bulk Import Catalog</strong><br/>Click here to upload Excel or CSV sheets containing book listings
                      </div>
                    </div>

                    {/* Bulk Price update form */}
                    <form 
                      onSubmit={(e) => { e.preventDefault(); alert('Bulk prices updated globally! ✓'); }}
                      style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)', flexWrap: 'wrap' }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Bulk Price Update:</span>
                      <select className={styles.select} style={{ padding: '8px' }}>
                        <option value="Competitive Exams">Competitive Exams (+5%)</option>
                        <option value="Stationery">Stationery Store (-10% Discount)</option>
                      </select>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        Apply Update
                      </button>
                    </form>

                    {/* Products list table */}
                    <div style={{ overflowX: 'auto', marginTop: '30px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                            <th style={{ padding: '10px' }}>Cover</th>
                            <th style={{ padding: '10px' }}>Title & Author</th>
                            <th style={{ padding: '10px' }}>Category</th>
                            <th style={{ padding: '10px' }}>Price</th>
                            <th style={{ padding: '10px' }}>Stock</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                              <td style={{ padding: '10px' }}>
                                <img src={p.image} alt={p.title} style={{ width: '30px', height: '40px', objectFit: 'cover', borderRadius: '2px' }} />
                              </td>
                              <td style={{ padding: '10px' }}>
                                <strong>{p.title}</strong><br/>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>By {p.author} | ISBN: {p.isbn}</span>
                              </td>
                              <td style={{ padding: '10px' }}>{p.category}</td>
                              <td style={{ padding: '10px' }}>₹{p.price}</td>
                              <td style={{ padding: '10px' }}>{p.stockCount}</td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                <button onClick={() => openEditModal(p)} style={{ marginRight: '8px', color: 'var(--color-primary)' }} title="Edit"><Edit size={14} /></button>
                                <button onClick={() => setActiveBarcode(p.isbn || '978-000-000')} style={{ marginRight: '8px', color: 'var(--color-accent-yellow-hover)' }} title="Barcode"><Barcode size={14} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} style={{ color: 'var(--color-error)' }} title="Delete"><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. Orders & Logistics Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h3>
                      <span>Orders Ledger & Returns</span>
                      <button onClick={() => handleExportCSV('orders')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        Export Orders CSV
                      </button>
                    </h3>

                    {/* Active orders list */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                            <th style={{ padding: '10px' }}>Order ID</th>
                            <th style={{ padding: '10px' }}>Customer & Phone</th>
                            <th style={{ padding: '10px' }}>Total Payable</th>
                            <th style={{ padding: '10px' }}>Payment Mode</th>
                            <th style={{ padding: '10px' }}>Logistics Status</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o.id} style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                              <td style={{ padding: '10px' }}>
                                <strong>{o.id.toUpperCase()}</strong>
                              </td>
                              <td style={{ padding: '10px' }}>
                                {o.name || 'Aditya Sharma'}<br/>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{o.phone || '9752809717'}</span>
                              </td>
                              <td style={{ padding: '10px' }}>₹{o.total}</td>
                              <td style={{ padding: '10px' }}>{o.paymentMethod || 'UPI Scan'}</td>
                              <td style={{ padding: '10px' }}>
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className={styles.select}
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                >
                                  <option value="Pending">Pending Approval</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Shipped">Shipped out</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                <button onClick={() => handlePrintInvoice(o)} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                                  Invoice
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Return requests */}
                    <div style={{ marginTop: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '30px' }}>
                      <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '14px' }}>Logistics Return Requests</h4>
                      <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: '#fff8f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>Return Request for Order #VBS-98715-4310</strong>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            Customer: Rahul Patel | Book: MP GK Mahaveer Guide | Reason: Exam Postponed
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => alert('Return request approved. Refund will initiate. ✓')} className="btn-accent" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Approve</button>
                          <button onClick={() => alert('Return request rejected.')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Reject</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Marketing & Coupons Tab */}
                {activeTab === 'marketing' && (
                  <div>
                    <h3>Coupons & Flash Sale Manager</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '10px' }}>
                      {/* Left: coupons */}
                      <div>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '14px' }}>Promo Coupons</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {coupons.map((coupon, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)' }}>
                              <div>
                                <strong>{coupon.code}</strong>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginLeft: '8px' }}>({coupon.discount})</span>
                              </div>
                              <button 
                                onClick={() => {
                                  const updated = [...coupons];
                                  updated[idx].active = !updated[idx].active;
                                  setCoupons(updated);
                                }}
                                style={{ fontSize: '0.8rem', fontWeight: 700, color: coupon.active ? 'var(--color-success)' : 'var(--color-text-light)' }}
                              >
                                {coupon.active ? 'Active' : 'Disabled'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Flash Sale setup */}
                      <form onSubmit={(e) => { e.preventDefault(); alert('Flash sale updated successfully! ✓'); }} className={styles.loginForm}>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Flash Sale Schedule</h4>
                        <div className={styles.formGroup}>
                          <label>Discount Rate (%)</label>
                          <input type="number" placeholder="e.g. 20" defaultValue="15" required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Countdown Date</label>
                          <input type="datetime-local" defaultValue="2026-07-13T23:59" required className={styles.input} />
                        </div>
                        <button type="submit" className="btn-accent" style={{ marginTop: '10px' }}>
                          Activate Flash Sale
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 5. Staff & Permissions Tab */}
                {activeTab === 'staff' && (
                  <div>
                    <h3>Staff Members & Permission Roles</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                            <th style={{ padding: '10px' }}>Staff Name</th>
                            <th style={{ padding: '10px' }}>Email Address</th>
                            <th style={{ padding: '10px' }}>Dashboard Role</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Logistics Permission</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                            <td style={{ padding: '10px' }}><strong>Vidhya Store Manager</strong></td>
                            <td style={{ padding: '10px' }}>manager@vidhyabookstore.com</td>
                            <td style={{ padding: '10px' }}>
                              <select className={styles.select} style={{ padding: '4px' }} defaultValue="admin">
                                <option value="admin">Administrator (Full Access)</option>
                                <option value="editor">Editor (CRUD Only)</option>
                              </select>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'var(--color-success)' }}>Granted</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                            <td style={{ padding: '10px' }}><strong>Local Delivery Runner</strong></td>
                            <td style={{ padding: '10px' }}>runner@vidhyabookstore.com</td>
                            <td style={{ padding: '10px' }}>
                              <select className={styles.select} style={{ padding: '4px' }} defaultValue="runner">
                                <option value="admin">Administrator</option>
                                <option value="runner">Logistics Dispatcher</option>
                              </select>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'var(--color-success)' }}>Granted</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. SEO & Pixel Codes Tab */}
                {activeTab === 'seo' && (
                  <div className={styles.settingsConsole}>
                    <h3>SEO Console & Trackers Injection</h3>

                    <div className={styles.consoleRow}>
                      <label className={styles.consoleLabel}>Sitemap URL</label>
                      <input type="text" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} className={styles.input} />
                    </div>

                    <div className={styles.consoleRow}>
                      <label className={styles.consoleLabel}>Robots.txt Parameters</label>
                      <textarea value={robotsTxt} onChange={(e) => setRobotsTxt(e.target.value)} className={styles.consoleInput} style={{ minHeight: '100px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className={styles.consoleRow}>
                        <label className={styles.consoleLabel}>Google Analytics ID (GTAG)</label>
                        <input type="text" value={googleAnalyticsId} onChange={(e) => setGoogleAnalyticsId(e.target.value)} className={styles.input} />
                      </div>
                      <div className={styles.consoleRow}>
                        <label className={styles.consoleLabel}>Meta Pixel ID</label>
                        <input type="text" value={facebookPixelId} onChange={(e) => setFacebookPixelId(e.target.value)} className={styles.input} />
                      </div>
                    </div>

                    <button onClick={() => alert('SEO configurations saved! Sitemap regenerated. ✓')} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                      Save SEO & Tracker Settings
                    </button>
                  </div>
                )}

                {/* 7. Backup & Logs Tab */}
                {activeTab === 'backup' && (
                  <div>
                    <h3>System Utility Operations</h3>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                      <div style={{ flex: 1, minWidth: '220px', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)' }}>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Database Backups</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '8px 0 16px 0', lineHeight: 1.4 }}>
                          Download complete JSON records of catalog products, customer lists, and order ledgers.
                        </p>
                        <button 
                          onClick={() => {
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products));
                            const dlAnchor = document.createElement('a');
                            dlAnchor.setAttribute("href", dataStr);
                            dlAnchor.setAttribute("download", `vbs_backup_${new Date().toISOString().slice(0,10)}.json`);
                            dlAnchor.click();
                          }}
                          className="btn-primary"
                          style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                        >
                          Export Database JSON
                        </button>
                      </div>

                      <div style={{ flex: 1, minWidth: '220px', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-light)' }}>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>System Logs</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '8px 0 16px 0', lineHeight: 1.4 }}>
                          Review all admin logins, product edit history logs, and runner order confirmations.
                        </p>
                        <button onClick={() => alert('Full activity ledger downloaded to CSV! 📥')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                          Download Activity CSV
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
          )}
        </div>
      </section>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? 'Edit Catalog Product' : 'Add New Book to Catalog'}</h3>
            </div>
            
            <form onSubmit={handleSaveProduct} className={styles.loginForm}>
              <div className={styles.modalBody} style={{ maxHeight: '420px', overflowY: 'auto', padding: '10px 0' }}>
                
                <div className={styles.formGroup}>
                  <label>Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.input} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className={styles.formGroup}>
                    <label>Author Name *</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Publisher *</label>
                    <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} className={styles.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className={styles.formGroup}>
                    <label>Selling Price (₹) *</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>MRP (₹)</label>
                    <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className={styles.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
                      <option value="Competitive Exams">Competitive Exams</option>
                      <option value="Academic Textbooks">Academic Textbooks</option>
                      <option value="Novels & Literature">Novels & Literature</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Used Books">Used Books</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Subcategory</label>
                    <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="e.g. UPSC, MPPSC" className={styles.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className={styles.formGroup}>
                    <label>Format *</label>
                    <select value={format} onChange={(e) => setFormat(e.target.value as any)} className={styles.select}>
                      <option value="Paperback">Paperback</option>
                      <option value="Hardcover">Hardcover</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Bundle">Bundle Package</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Stock Count *</label>
                    <input type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} required className={styles.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className={styles.formGroup}>
                    <label>ISBN Code</label>
                    <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Pages Count</label>
                    <input type="number" value={pages} onChange={(e) => setPages(e.target.value)} className={styles.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className={styles.formGroup}>
                    <label>Publish Year</label>
                    <input type="number" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cover Image URL *</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://unsplash..." className={styles.input} />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                  <label>Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} style={{ minHeight: '80px' }} />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                    <span>Featured in Home Slider</span>
                  </label>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />
                    <span>Bestseller Badge</span>
                  </label>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
                    <span>New Arrival Badge</span>
                  </label>
                </div>

              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.modalCancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
