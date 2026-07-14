'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { 
  Lock, Plus, LogOut, CheckCircle, Package, RefreshCw, Trash2, ChevronRight,
  Edit, ArrowRight, BarChart, ShoppingBag, Users, Settings, Database, 
  Tag, Barcode, Upload, ShieldAlert, FileText, Globe, Percent, Key, Copy, Eye, RotateCw, ZoomIn, ZoomOut, Check, X, Clipboard, ArrowUpRight, ShieldCheck, Clock
} from 'lucide-react';
import styles from './admin.module.css';

type AdminTab = 'dashboard' | 'inventory' | 'orders' | 'marketing' | 'staff' | 'seo' | 'content' | 'backup';

// Mappings for RBAC tabs access control
const ROLE_TABS: Record<string, AdminTab[]> = {
  'Owner': ['dashboard', 'inventory', 'orders', 'marketing', 'staff', 'seo', 'content', 'backup'],
  'Super Admin': ['dashboard', 'inventory', 'orders', 'marketing', 'staff', 'seo', 'content', 'backup'],
  'Inventory Manager': ['dashboard', 'inventory', 'backup'],
  'Sales Manager': ['dashboard', 'orders', 'marketing'],
  'Delivery Manager': ['orders'],
  'Content Manager': ['content', 'seo'],
  'Marketing Manager': ['marketing', 'seo'],
  'Customer Support': ['dashboard', 'orders'],
  'Viewer': ['dashboard']
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@vidhya.com');
  const [passwordInput, setPasswordInput] = useState('VidhyaBookStoreIndore2026');
  
  // 2FA Security states
  const [is2faRequired, setIs2faRequired] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [authError, setAuthError] = useState('');
  
  // User info
  const [userRole, setUserRole] = useState<string>('Viewer');
  const [userName, setUserName] = useState<string>('Guest');

  // SPA Sidebar Tabs
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Soft deletion filtering
  const [showSoftDeleted, setShowSoftDeleted] = useState(false);

  // Checkboxes for bulk actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkValue, setBulkValue] = useState<string>('');

  // Active logs & backups states
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [ledgerLogs, setLedgerLogs] = useState<any[]>([]);

  // Edit/Add modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Save status indicator
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isDirty, setIsDirty] = useState(false);

  // Standard eCommerce product schema form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [barcode, setBarcode] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('English');
  const [edition, setEdition] = useState('1st');
  const [pubDate, setPubDate] = useState('2026-01-01');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [specifications, setSpecifications] = useState('');
  
  const [mrp, setMrp] = useState('399');
  const [sellingPrice, setSellingPrice] = useState('299');
  const [gst, setGst] = useState('5'); // 5%, 12%, 18%

  const [sku, setSku] = useState('');
  const [stockCount, setStockCount] = useState('15');
  const [lowStockAlert, setLowStockAlert] = useState('5');
  const [warehouseLocation, setWarehouseLocation] = useState('Aisle A, Shelf 2');

  const [primaryCategory, setPrimaryCategory] = useState('Competitive Exams');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState('');

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [slug, setSlug] = useState('');

  const [visibility, setVisibility] = useState<'Published' | 'Draft' | 'Hidden'>('Published');
  const [featured, setFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Cover image cropper states
  const [image, setImage] = useState('');
  const [backCoverImage, setBackCoverImage] = useState('');
  const [insidePageImage, setInsidePageImage] = useState('');
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0); // 0, 90, 180, 270
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Ledger adjustment modal
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [ledgerProductId, setLedgerProductId] = useState('');
  const [ledgerAction, setLedgerAction] = useState<'Increase' | 'Decrease' | 'Purchase' | 'Adjustment' | 'Damage' | 'Lost' | 'Returned'>('Purchase');
  const [ledgerQty, setLedgerQty] = useState('5');
  const [ledgerReason, setLedgerReason] = useState('');

  // Timeline Order status tracking
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState<any | null>(null);

  // JWT Decoder client-side
  const decodeToken = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  // Load token & session security activity tracker on load
  useEffect(() => {
    const savedToken = localStorage.getItem('vbs_admin_token');
    if (savedToken) {
      const payload = decodeToken(savedToken);
      if (payload) {
        setUserRole(payload.role || 'Viewer');
        setUserName(payload.name || 'Staff');
        setIsAuthenticated(true);
        fetchDashboardData(savedToken);
      } else {
        localStorage.removeItem('vbs_admin_token');
      }
    }

    // Idle timeout tracker (15 minutes limit)
    let idleTimer: NodeJS.Timeout;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (localStorage.getItem('vbs_admin_token')) {
          handleLogout();
          alert('🔐 Session expired due to 15 minutes of inactivity. Please login again.');
        }
      }, 15 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, []);

  // Auto-save draft every 30 seconds if dirty
  useEffect(() => {
    const draftTimer = setInterval(() => {
      if (isDirty && isModalOpen) {
        setSaveStatus('saving');
        const draftPayload = {
          title, subtitle, isbn, barcode, author, publisher, language, edition, pubDate, description, features, specifications,
          mrp, sellingPrice, gst, sku, stockCount, lowStockAlert, warehouseLocation, primaryCategory, subcategory, tags,
          metaTitle, metaDescription, keywords, ogImage, slug, visibility, featured, isBestseller, isNewArrival,
          image, backCoverImage, insidePageImage
        };
        localStorage.setItem('vbs_product_draft', JSON.stringify(draftPayload));
        setTimeout(() => {
          setSaveStatus('saved');
        }, 1000);
      }
    }, 30000);

    return () => clearInterval(draftTimer);
  }, [isDirty, isModalOpen, title, subtitle, isbn, barcode, author, publisher, language, edition, pubDate, description, features, specifications, mrp, sellingPrice, gst, sku, stockCount, lowStockAlert, warehouseLocation, primaryCategory, subcategory, tags, metaTitle, metaDescription, keywords, ogImage, slug, visibility, featured, isBestseller, isNewArrival, image, backCoverImage, insidePageImage]);

  // Leave warning dialog
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle credentials verification and OTP request
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const payload: any = { email: emailInput, password: passwordInput };
      if (is2faRequired) {
        payload.otp = otpInput;
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.is2faRequired) {
          setIs2faRequired(true);
          setOtpCooldown(60);
          // Auto-fill OTP from response payload for testing
          setOtpInput(data.otp);
          alert(`🔐 6-digit OTP code dispatched!\nDeveloper Log OTP: [ ${data.otp} ]`);
        } else {
          localStorage.setItem('vbs_admin_token', data.token);
          setUserRole(data.role);
          setUserName(data.name);
          setIsAuthenticated(true);
          // Set active tab to whatever the role permits
          const allowedTabs = ROLE_TABS[data.role] || ['dashboard'];
          setActiveTab(allowedTabs[0]);
          fetchDashboardData(data.token);
        }
      } else {
        setAuthError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setAuthError('Authentication error. Account locked or server error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vbs_admin_token');
    setIsAuthenticated(false);
    setOrders([]);
    setProducts([]);
    setIs2faRequired(false);
    setOtpInput('');
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

      // Fetch products (pass auth token so soft-deleted books are included for admin)
      const productsRes = await fetch('/api/products?limit=200', {
        headers: { 'Authorization': token }
      });
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }

      // Fetch system audit logs
      const logsRes = await fetch('/api/admin/audit-logs', {
        headers: { 'Authorization': token }
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData);
      }

      // Fetch inventory ledgers
      const ledgerRes = await fetch('/api/admin/inventory-ledger', {
        headers: { 'Authorization': token }
      });
      if (ledgerRes.ok) {
        const ledgerData = await ledgerRes.json();
        setLedgerLogs(ledgerData);
      }

      // Fetch backups list
      const backupRes = await fetch('/api/admin/backups', {
        headers: { 'Authorization': token }
      });
      if (backupRes.ok) {
        const backupsData = await backupRes.json();
        setBackups(backupsData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Order status timelines
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
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrderForTimeline && selectedOrderForTimeline.id === orderId) {
          setSelectedOrderForTimeline(prev => ({ ...prev, status: newStatus }));
        }
        alert(`Order status updated successfully! ✓`);
        fetchDashboardData(token);
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Duplicate a book in the catalog
  const handleDuplicateBook = (product: any) => {
    const duplicated = {
      ...product,
      id: undefined,
      title: `${product.title} (Copy)`,
      isbn: `${product.isbn ? product.isbn + '-C' : ''}`,
      sku: `${product.sku ? product.sku + '-copy' : ''}`,
      publishYear: new Date().getFullYear()
    };
    openEditModal(duplicated);
  };

  // Bulk check box toggling
  const handleToggleSelectProduct = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAllProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(products.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  // Bulk actions operations on catalog
  const handleExecuteBulkAction = async () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least one product.');
      return;
    }
    if (!bulkAction) {
      alert('Please select a bulk action.');
      return;
    }

    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    const val = bulkValue.trim();
    setIsLoading(true);

    try {
      let successCount = 0;
      for (const id of selectedProductIds) {
        const prod = products.find(p => p.id === id);
        if (!prod) continue;

        let fieldsToUpdate: any = {};

        if (bulkAction === 'price_adjust') {
          const factor = 1 + (Number(val) / 100);
          fieldsToUpdate.price = Math.round(prod.price * factor);
          if (prod.originalPrice) {
            fieldsToUpdate.originalPrice = Math.round(prod.originalPrice * factor);
          }
        } else if (bulkAction === 'stock_set') {
          fieldsToUpdate.stockCount = Number(val);
          fieldsToUpdate.inStock = Number(val) > 0;
        } else if (bulkAction === 'publish') {
          fieldsToUpdate.status = 'Published';
          fieldsToUpdate.visibility = 'Published';
        } else if (bulkAction === 'draft') {
          fieldsToUpdate.status = 'Draft';
          fieldsToUpdate.visibility = 'Draft';
        } else if (bulkAction === 'soft_delete') {
          fieldsToUpdate.deletedAt = new Date().toISOString();
          fieldsToUpdate.status = 'Hidden';
        } else if (bulkAction === 'restore') {
          fieldsToUpdate.deletedAt = null;
          fieldsToUpdate.status = 'Published';
        }

        const res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(fieldsToUpdate)
        });

        if (res.ok) {
          successCount++;
        }
      }

      alert(`Bulk action completed! Successfully updated ${successCount} products. ✓`);
      setSelectedProductIds([]);
      setBulkValue('');
      setBulkAction('');
      fetchDashboardData(token);
    } catch (err) {
      alert('Error executing bulk action.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stock adjustments transactions
  const handleSaveStockLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/inventory-ledger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          productId: ledgerProductId,
          action: ledgerAction,
          quantity: Number(ledgerQty),
          reason: ledgerReason,
          adminName: userName
        })
      });

      if (res.ok) {
        setIsLedgerModalOpen(false);
        setLedgerReason('');
        setLedgerQty('5');
        alert('Stock ledger transaction posted successfully! ✓');
        fetchDashboardData(token);
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error}`);
      }
    } catch {
      alert('Failed to post ledger adjustment.');
    } finally {
      setIsLoading(false);
    }
  };

  // Backups snapshots operations
  const handleCreateBackup = async () => {
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ action: 'create' })
      });

      if (res.ok) {
        alert('Unified database backup snapshot created successfully! ✓');
        fetchDashboardData(token);
      }
    } catch {
      alert('Failed to create backup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm(`WARNING: Restoring backup "${filename}" will overwrite all catalog products and orders list. Do you want to proceed?`)) return;
    
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ action: 'restore', filename })
      });

      if (res.ok) {
        alert('Database snapshot restored successfully! ✓ reloading catalog...');
        fetchDashboardData(token);
      } else {
        const err = await res.json();
        alert(`Failed to restore: ${err.error}`);
      }
    } catch {
      alert('Restore backup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add/Edit product states binders
  const openAddModal = () => {
    // Check if there is a draft saved
    const savedDraft = localStorage.getItem('vbs_product_draft');
    if (savedDraft) {
      if (confirm('A saved draft product was found. Would you like to restore it?')) {
        const draft = JSON.parse(savedDraft);
        setEditingProduct(null);
        setTitle(draft.title || '');
        setSubtitle(draft.subtitle || '');
        setIsbn(draft.isbn || '');
        setBarcode(draft.barcode || '');
        setAuthor(draft.author || '');
        setPublisher(draft.publisher || '');
        setLanguage(draft.language || 'English');
        setEdition(draft.edition || '1st');
        setPubDate(draft.pubDate || '2026-01-01');
        setDescription(draft.description || '');
        setFeatures(draft.features || '');
        setSpecifications(draft.specifications || '');
        setMrp(draft.mrp || '399');
        setSellingPrice(draft.sellingPrice || '299');
        setGst(draft.gst || '5');
        setSku(draft.sku || '');
        setStockCount(draft.stockCount || '15');
        setLowStockAlert(draft.lowStockAlert || '5');
        setWarehouseLocation(draft.warehouseLocation || 'Aisle A, Shelf 2');
        setPrimaryCategory(draft.primaryCategory || 'Competitive Exams');
        setSubcategory(draft.subcategory || '');
        setTags(draft.tags || '');
        setMetaTitle(draft.metaTitle || '');
        setMetaDescription(draft.metaDescription || '');
        setKeywords(draft.keywords || '');
        setOgImage(draft.ogImage || '');
        setSlug(draft.slug || '');
        setVisibility(draft.visibility || 'Published');
        setFeatured(!!draft.featured);
        setIsBestseller(!!draft.isBestseller);
        setIsNewArrival(!!draft.isNewArrival);
        setImage(draft.image || '');
        setBackCoverImage(draft.backCoverImage || '');
        setInsidePageImage(draft.insidePageImage || '');
        setIsModalOpen(true);
        setIsDirty(true);
        return;
      }
    }

    setEditingProduct(null);
    setTitle('');
    setSubtitle('');
    setIsbn('');
    setBarcode('');
    setAuthor('');
    setPublisher('');
    setLanguage('English');
    setEdition('1st');
    setPubDate('2026-01-01');
    setDescription('');
    setFeatures('');
    setSpecifications('');
    setMrp('399');
    setSellingPrice('299');
    setGst('5');
    setSku('');
    setStockCount('15');
    setLowStockAlert('5');
    setWarehouseLocation('Aisle A, Shelf 2');
    setPrimaryCategory('Competitive Exams');
    setSubcategory('');
    setTags('');
    setMetaTitle('');
    setMetaDescription('');
    setKeywords('');
    setOgImage('');
    setSlug('');
    setVisibility('Published');
    setFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(false);
    setImage('');
    setBackCoverImage('');
    setInsidePageImage('');
    setIsModalOpen(true);
    setIsDirty(false);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setTitle(product.title || '');
    setSubtitle(product.subtitle || '');
    setIsbn(product.isbn || '');
    setBarcode(product.barcode || '');
    setAuthor(product.author || '');
    setPublisher(product.publisher || '');
    setLanguage(product.language || 'English');
    setEdition(product.edition || '1st');
    setPubDate(product.publishYear ? `${product.publishYear}-01-01` : '2026-01-01');
    setDescription(product.description || '');
    setFeatures(product.features || '');
    setSpecifications(product.specifications || '');
    setMrp(product.originalPrice ? product.originalPrice.toString() : product.price.toString());
    setSellingPrice(product.price.toString());
    setGst(product.gst || '5');
    setSku(product.sku || '');
    setStockCount(product.stockCount ? product.stockCount.toString() : '10');
    setLowStockAlert(product.lowStockAlert ? product.lowStockAlert.toString() : '5');
    setWarehouseLocation(product.warehouseLocation || 'Aisle A, Shelf 2');
    setPrimaryCategory(product.category || 'Competitive Exams');
    setSubcategory(product.subcategory || '');
    setTags(product.tags ? product.tags.join(', ') : '');
    setMetaTitle(product.metaTitle || '');
    setMetaDescription(product.metaDescription || '');
    setKeywords(product.keywords ? product.keywords.join(', ') : '');
    setOgImage(product.ogImage || '');
    setSlug(product.id || '');
    setVisibility(product.visibility || 'Published');
    setFeatured(!!product.featured);
    setIsBestseller(!!product.isBestseller);
    setIsNewArrival(!!product.isNewArrival);
    setImage(product.image || '');
    setBackCoverImage(product.backCoverImage || '');
    setInsidePageImage(product.insidePageImage || '');
    setIsModalOpen(true);
    setIsDirty(false);
  };

  // Perform client-side image editing canvas adjustments before upload
  const handleUploadImage = async (dataUrl: string, type: 'cover' | 'back' | 'inside') => {
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    setUploadProgress(20);
    
    // Simulate image cropping, rotating and WebP compression using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgObj = new Image();
    
    imgObj.onload = async () => {
      // Set fixed resolution 600x800 for cover aspect ratios
      canvas.width = 600;
      canvas.height = 800;
      
      if (ctx) {
        ctx.save();
        // Handle rotation
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((imageRotation * Math.PI) / 180);
        ctx.scale(imageZoom, imageZoom);
        ctx.drawImage(imgObj, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();
      }

      setUploadProgress(60);
      const WebpDataUrl = canvas.toDataURL('image/webp', 0.85); // Webp with 85% compression

      try {
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ image: WebpDataUrl })
        });

        if (uploadRes.ok) {
          const resData = await uploadRes.json();
          setUploadProgress(100);
          if (type === 'cover') setImage(resData.url);
          else if (type === 'back') setBackCoverImage(resData.url);
          else if (type === 'inside') setInsidePageImage(resData.url);
          setTimeout(() => setUploadProgress(0), 1000);
        } else {
          alert('Upload failed.');
          setUploadProgress(0);
        }
      } catch {
        alert('Network upload error.');
        setUploadProgress(0);
      }
    };

    imgObj.src = dataUrl;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    // Check duplicate ISBN/SKUs client-side
    const duplicateIsbn = products.find(p => p.isbn === isbn && (!editingProduct || p.id !== editingProduct.id));
    if (isbn && duplicateIsbn) {
      alert(`⚠️ Validation Error: Duplicate ISBN detected. "${duplicateIsbn.title}" is already registered with ISBN: ${isbn}`);
      return;
    }

    const duplicateSku = products.find(p => p.sku === sku && (!editingProduct || p.id !== editingProduct.id));
    if (sku && duplicateSku) {
      alert(`⚠️ Validation Error: Duplicate SKU detected. "${duplicateSku.title}" is already registered with SKU: ${sku}`);
      return;
    }

    const payload = {
      title,
      subtitle,
      author,
      publisher,
      price: parseFloat(sellingPrice),
      originalPrice: mrp ? parseFloat(mrp) : undefined,
      category: primaryCategory,
      subcategory,
      format: primaryCategory === 'Stationery' ? 'Stationery' : 'Paperback',
      image,
      backCoverImage,
      insidePageImage,
      description,
      stockCount: parseInt(stockCount),
      inStock: parseInt(stockCount) > 0,
      isbn,
      sku,
      lowStockAlert: parseInt(lowStockAlert),
      warehouseLocation,
      language,
      edition,
      publishYear: new Date(pubDate).getFullYear(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      metaTitle,
      metaDescription,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      ogImage,
      visibility,
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
        setIsDirty(false);
        localStorage.removeItem('vbs_product_draft');
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
    // Soft Delete verification
    if (!confirm('Are you sure you want to soft delete this product? It will be hidden from catalog and can be restored later.')) return;
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    try {
      // Soft delete updates status to hidden and registers deletedAt timestamp
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ 
          deletedAt: new Date().toISOString(),
          status: 'Hidden',
          visibility: 'Hidden'
        })
      });

      if (res.ok) {
        alert('Product soft deleted successfully! ✓ You can view and restore it by enabling "Show Soft Deleted" filter.');
        fetchDashboardData(token);
      }
    } catch (err) {
      alert('Failed to soft delete product');
    }
  };

  const handlePermanentDeleteProduct = async (productId: string) => {
    if (!confirm('🚨 WARNING: You are performing a permanent database delete. This cannot be undone. Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('vbs_admin_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });

      if (res.ok) {
        alert('Product deleted permanently from catalog successfully! ✓');
        fetchDashboardData(token);
      }
    } catch {
      alert('Permanent delete failed.');
    }
  };



  // Printable Invoice
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
              <p>Invoice No: INV-${order.id.slice(-6).toUpperCase()}<br/>Date: ${order.createdAt || order.date || new Date().toISOString().slice(0,10)}</p>
            </div>
          </div>
          <div class="details">
            <h4>Billed To:</h4>
            <p>
              <strong>Customer Name:</strong> ${order.customerName || order.name || 'Customer'}<br/>
              <strong>Phone:</strong> ${order.phone || '9876543210'}<br/>
              <strong>Shipping Address:</strong> ${order.address || 'Bhanwarkuan, Indore'}
            </p>
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
              ${Array.isArray(order.items) && order.items.length > 0
                ? order.items.map((item: any) => `
                    <tr>
                      <td>${item.title || 'Book/Stationery'}</td>
                      <td>${item.quantity || 1}</td>
                      <td>₹${item.price || 0}</td>
                      <td>₹${(item.price || 0) * (item.quantity || 1)}</td>
                    </tr>
                  `).join('')
                : `
                    <tr>
                      <td>Study material and books</td>
                      <td>1</td>
                      <td>₹${order.totalAmount || order.total || 0}</td>
                      <td>₹${order.totalAmount || order.total || 0}</td>
                    </tr>
                  `
              }
            </tbody>
          </table>
          <div class="total">Total Payable Amount: ₹${order.totalAmount || order.total || 0}</div>
        </body>
      </html>
    `);
    w.document.close();
  };

  // Filter products list depending on soft deletion
  const visibleProducts = products.filter(p => {
    const isDeleted = !!p.deletedAt;
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.author.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.isbn && p.isbn.includes(productSearch));

    if (showSoftDeleted) return isDeleted && matchesSearch;
    return !isDeleted && matchesSearch;
  });

  // Calculate dashboard stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;
  const returnRequestsCount = orders.filter(o => o.status === 'Returned' || o.status === 'Refunded').length;
  
  const profitMargin = Math.round(totalRevenue * 0.25); // 25% profit margin
  const outOfStockCount = products.filter(p => p.stockCount === 0).length;
  const lowStockCount = products.filter(p => p.stockCount > 0 && p.stockCount <= 5).length;
  const booksAddedTodayCount = products.filter(p => p.publishYear >= 2026).length;

  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Real daily sales: aggregate order totals by day-of-week (Sun=0..Sat=6)
  const dailySalesByDay = Array(7).fill(0);
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  orders.forEach(o => {
    const day = new Date(o.createdAt || Date.now()).getDay();
    dailySalesByDay[day] += (o.totalAmount || 0);
  });
  const maxDailySale = Math.max(...dailySalesByDay, 1);

  // Real category performance: count products per top category
  const categoryCounts: Record<string, number> = {};
  products.filter(p => !p.deletedAt).forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  const totalCatProducts = Object.values(categoryCounts).reduce((a, b) => a + b, 1);
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], i) => ({
      name,
      val: Math.round((count / totalCatProducts) * 100),
      color: ['var(--color-primary)', '#FCD116', '#047857', '#dc2626', '#7c3aed'][i]
    }));

  return (
    <div className={styles.main}>
      <Navbar />

      <section className={styles.adminSection}>
        <div className="container">
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={14} />
            <span className={styles.breadcrumbCurrent}>Enterprise Bookstore ERP</span>
          </div>

          {/* Guest Authentication Screen */}
          {!isAuthenticated ? (
            <div className={styles.loginCard}>
              <div className={styles.loginIcon}><Lock size={28} /></div>
              <h2 className={styles.loginTitle}>Vidhya ERP Console</h2>
              <p className={styles.loginText}>Enter credentials to access bookstore catalog &amp; logistics.</p>
              
              <form onSubmit={handleLogin} className={styles.loginForm}>
                {!is2faRequired ? (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="adm-email">Staff Email Address</label>
                      <input
                        type="email"
                        id="adm-email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@vidhya.com"
                        required
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="adm-pass">Security Code / Password</label>
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
                  </>
                ) : (
                  <div className={styles.formGroup}>
                    <label htmlFor="adm-otp">Two-Factor Authentication (2FA) Code</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        id="adm-otp"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="6-digit OTP code"
                        required
                        maxLength={6}
                        className={styles.input}
                        style={{ letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold', flex: 1 }}
                      />
                      <button
                        type="button"
                        disabled={otpCooldown > 0}
                        onClick={handleLogin}
                        className="btn-secondary"
                        style={{ padding: '10px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        {otpCooldown > 0 ? `Resend (${otpCooldown}s)` : 'Resend OTP'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                      OTP expires in 5 minutes. Check developer logs or request payload.
                    </p>
                  </div>
                )}
                {authError && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', fontWeight: 600 }}>⚠️ {authError}</div>}
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                  {isLoading ? 'Verifying...' : is2faRequired ? 'Access ERP Dashboard' : 'Verify & Send 2FA Code'}
                </button>
              </form>
            </div>
          ) : (
            /* ERP Dashboard Container */
            <div className={styles.adminLayout}>
              {/* Sidebar Navigation */}
              <aside className={styles.adminSidebar}>
                <div style={{ padding: '14px', borderBottom: '1px solid var(--color-border)', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-light)', display: 'block', textTransform: 'uppercase' }}>Current Session</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{userName}</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600 }}>Role: {userRole}</span>
                </div>
                
                <div className={styles.sidebarMenu}>
                  {ROLE_TABS[userRole]?.includes('dashboard') && (
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={activeTab === 'dashboard' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <BarChart size={16} />
                      <span>Dashboard KPIs</span>
                    </button>
                  )}
                  {ROLE_TABS[userRole]?.includes('inventory') && (
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className={activeTab === 'inventory' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <Package size={16} />
                      <span>Book Catalog</span>
                    </button>
                  )}
                  {ROLE_TABS[userRole]?.includes('orders') && (
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={activeTab === 'orders' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <ShoppingBag size={16} />
                      <span>Order Progression</span>
                    </button>
                  )}
                  {ROLE_TABS[userRole]?.includes('marketing') && (
                    <button
                      onClick={() => setActiveTab('marketing')}
                      className={activeTab === 'marketing' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <Tag size={16} />
                      <span>Promo Coupons</span>
                    </button>
                  )}
                  {ROLE_TABS[userRole]?.includes('staff') && (
                    <button
                      onClick={() => setActiveTab('staff')}
                      className={activeTab === 'staff' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <Users size={16} />
                      <span>Staff Registry</span>
                    </button>
                  )}
                  {ROLE_TABS[userRole]?.includes('seo') && (
                    <button
                      onClick={() => setActiveTab('seo')}
                      className={activeTab === 'seo' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <Globe size={16} />
                      <span>SEO Configurations</span>
                    </button>
                  )}
                  {ROLE_TABS[userRole]?.includes('content') && (
                    <button
                      onClick={() => setActiveTab('content')}
                      className={activeTab === 'content' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <FileText size={16} />
                      <span>CMS & Blog Editor</span>
                    </button>
                  )}
                  {ROLE_TABS[userRole]?.includes('backup') && (
                    <button
                      onClick={() => setActiveTab('backup')}
                      className={activeTab === 'backup' ? styles.activeMenuItem : styles.menuItem}
                    >
                      <Database size={16} />
                      <span>Audit Logs & Backups</span>
                    </button>
                  )}
                </div>

                <button 
                  onClick={handleLogout} 
                  style={{ 
                    marginTop: '30px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    color: 'var(--color-error)',
                    padding: '10px 14px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout Session</span>
                </button>
              </aside>

              {/* Main Panel content */}
              <main className={styles.adminContentCard}>
                
                {/* 1. DASHBOARD ANALYTICS */}
                {activeTab === 'dashboard' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                      <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Sales & Visitor Metrics</h3>
                      <button onClick={() => fetchDashboardData(localStorage.getItem('vbs_admin_token') || '')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={13} /> Refresh Metrics
                      </button>
                    </div>

                    {/* KPIs Metrics Matrix */}
                    <div className={styles.kpiGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Gross Revenue</h4>
                          <div className={styles.kpiVal}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                        </div>
                        <FileText className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Profit (Net)</h4>
                          <div className={styles.kpiVal} style={{ color: 'var(--color-success)' }}>₹{profitMargin.toLocaleString('en-IN')}</div>
                        </div>
                        <Percent className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Total Orders</h4>
                          <div className={styles.kpiVal}>{totalOrdersCount} Orders</div>
                        </div>
                        <ShoppingBag className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Average Order Val</h4>
                          <div className={styles.kpiVal}>₹{averageOrderValue}</div>
                        </div>
                        <ArrowUpRight className={styles.kpiIcon} size={20} />
                      </div>

                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Low Stock Warnings</h4>
                          <div className={styles.kpiVal} style={{ color: lowStockCount > 0 ? 'var(--color-error)' : 'inherit' }}>{lowStockCount} Books</div>
                        </div>
                        <ShieldAlert className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Out of Stock</h4>
                          <div className={styles.kpiVal} style={{ color: outOfStockCount > 0 ? 'var(--color-error)' : 'inherit' }}>{outOfStockCount} Books</div>
                        </div>
                        <Trash2 className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Pending Approvals</h4>
                          <div className={styles.kpiVal}>{pendingOrdersCount} orders</div>
                        </div>
                        <Clock className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Cancelled</h4>
                          <div className={styles.kpiVal}>{cancelledOrdersCount} orders</div>
                        </div>
                        <X className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Returns & Refund</h4>
                          <div className={styles.kpiVal}>{returnRequestsCount} requests</div>
                        </div>
                        <RefreshCw className={styles.kpiIcon} size={20} />
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiText}>
                          <h4>Added Today</h4>
                          <div className={styles.kpiVal}>{booksAddedTodayCount} books</div>
                        </div>
                        <Plus className={styles.kpiIcon} size={20} />
                      </div>
                    </div>

                    {/* SVG Graphic Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginTop: '30px' }}>
                      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff' }}>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem' }}>Orders by Day of Week</h4>
                        {totalOrdersCount === 0 ? (
                          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>No orders yet — chart will populate as orders come in.</div>
                        ) : (
                          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                            {dailySalesByDay.map((amount, i) => {
                              const barH = Math.round((amount / maxDailySale) * 150);
                              return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                  <div style={{ width: '100%', height: `${barH || 4}px`, background: barH > 0 ? 'var(--gradient-primary)' : 'var(--color-bg-light)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                    {amount > 0 && <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap' }}>₹{amount}</span>}
                                  </div>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{dayLabels[i]}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff' }}>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem' }}>Catalog by Category</h4>
                        {topCategories.length === 0 ? (
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>No active books in catalog.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {topCategories.map(c => (
                              <div key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                                  <span>{c.name}</span>
                                  <span>{c.val}%</span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: 'var(--color-bg-light)', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${c.val}%`, height: '100%', backgroundColor: c.color }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Low stock indicators & system warnings log */}
                    <div style={{ marginTop: '30px' }}>
                      <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '12px' }}>Inventory Warnings & Notifications</h4>
                      <div className={styles.logsList}>
                        {products.filter(p => p.stockCount <= 5).map(p => (
                          <div key={p.id} className={styles.logRow} style={{ borderLeft: '3px solid var(--color-error)', backgroundColor: '#fff8f8' }}>
                            <span className={styles.logAction}>
                              <strong>Low Stock Alert:</strong> "{p.title}" has only {p.stockCount} left in warehousing ({p.warehouseLocation}).
                            </span>
                            <span className={styles.logTime}>Adjust Stock</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CATALOG MANAGEMENT */}
                {activeTab === 'inventory' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                      <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Book Catalog &amp; Stocks</h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { setIsLedgerModalOpen(true); }} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <RotateCw size={14} /> Adjust Stock Ledger
                        </button>
                        <button onClick={openAddModal} className="btn-accent" style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Plus size={14} /> Catalog New Book
                        </button>
                      </div>
                    </div>

                    {/* Filters & Bulk Operations Controls */}
                    <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg-light)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          placeholder="Search books by title, author, SKU, or ISBN..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className={styles.input}
                          style={{ flex: 1, minWidth: '220px', padding: '8px 12px' }}
                        />

                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={showSoftDeleted}
                            onChange={(e) => setShowSoftDeleted(e.target.checked)}
                          />
                          <span>Show Soft Deleted</span>
                        </label>
                      </div>

                      {/* Bulk actions form */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                          Bulk Actions ({selectedProductIds.length} Selected):
                        </span>
                        <select
                          value={bulkAction}
                          onChange={(e) => setBulkAction(e.target.value)}
                          className={styles.select}
                          style={{ padding: '6px', fontSize: '0.8rem' }}
                        >
                          <option value="">Choose Action...</option>
                          <option value="price_adjust">Price Adjustment (%)</option>
                          <option value="stock_set">Set Stock Count</option>
                          <option value="publish">Publish visibility</option>
                          <option value="draft">Move to Draft</option>
                          <option value="soft_delete">Soft Delete</option>
                          {showSoftDeleted && <option value="restore">Restore soft-deleted</option>}
                        </select>
                        <input
                          type="text"
                          placeholder="value (e.g. 5, -10)"
                          value={bulkValue}
                          onChange={(e) => setBulkValue(e.target.value)}
                          className={styles.input}
                          style={{ padding: '6px', fontSize: '0.8rem', width: '120px' }}
                        />
                        <button onClick={handleExecuteBulkAction} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          Apply Bulk Action
                        </button>
                      </div>
                    </div>

                    {/* Products Grid Ledger */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-bg-light)' }}>
                            <th style={{ padding: '10px', width: '40px' }}>
                              <input 
                                type="checkbox" 
                                onChange={handleSelectAllProducts}
                                checked={selectedProductIds.length === products.length && products.length > 0} 
                              />
                            </th>
                            <th style={{ padding: '10px' }}>Book / Details</th>
                            <th style={{ padding: '10px' }}>Category</th>
                            <th style={{ padding: '10px' }}>Prices</th>
                            <th style={{ padding: '10px' }}>Warehousing</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Action controls</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleProducts.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s' }}>
                              <td style={{ padding: '10px' }}>
                                <input
                                  type="checkbox"
                                  checked={selectedProductIds.includes(p.id)}
                                  onChange={() => handleToggleSelectProduct(p.id)}
                                />
                              </td>
                              <td style={{ padding: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <img src={p.image} alt={p.title} style={{ width: '34px', height: '48px', objectFit: 'cover', borderRadius: '4px', boxShadow: 'var(--shadow-sm)' }} />
                                <div>
                                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-primary)' }}>{p.title}</strong><br/>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>By {p.author} | ISBN: {p.isbn || 'N/A'}</span>
                                </div>
                              </td>
                              <td style={{ padding: '10px' }}>{p.category}</td>
                              <td style={{ padding: '10px' }}>
                                <strong>₹{p.price}</strong>{' '}
                                {p.originalPrice && <span style={{ textDecoration: 'line-through', color: 'var(--color-text-light)', fontSize: '0.72rem' }}>₹{p.originalPrice}</span>}
                              </td>
                              <td style={{ padding: '10px' }}>
                                <span style={{ fontWeight: 700, color: p.stockCount === 0 ? 'var(--color-error)' : p.stockCount <= 5 ? '#d97706' : '#047857' }}>
                                  {p.stockCount} in stock
                                </span><br/>
                                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-light)' }}>{p.warehouseLocation || 'Indore Aisle'}</span>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, backgroundColor: p.visibility === 'Draft' ? '#f1f5f9' : p.visibility === 'Hidden' ? '#fef2f2' : '#ecfdf5', color: p.visibility === 'Draft' ? '#475569' : p.visibility === 'Hidden' ? '#b91c1c' : '#047857' }}>
                                  {p.visibility || 'Published'}
                                </span>
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                <button onClick={() => openEditModal(p)} style={{ marginRight: '8px', color: 'var(--color-primary)' }} title="Edit"><Edit size={14} /></button>
                                <button onClick={() => handleDuplicateBook(p)} style={{ marginRight: '8px', color: '#0f766e' }} title="Duplicate"><Copy size={14} /></button>
                                {showSoftDeleted ? (
                                  <>
                                    <button 
                                      onClick={async () => {
                                        const token = localStorage.getItem('vbs_admin_token');
                                        await fetch(`/api/products/${p.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
                                          body: JSON.stringify({ deletedAt: null, status: 'Published', visibility: 'Published' })
                                        });
                                        alert('Product restored successfully! ✓');
                                        fetchDashboardData(token || '');
                                      }}
                                      style={{ marginRight: '8px', color: 'var(--color-success)', fontSize: '0.72rem', fontWeight: 700 }}
                                    >
                                      Restore
                                    </button>
                                    <button onClick={() => handlePermanentDeleteProduct(p.id)} style={{ color: 'var(--color-error)' }} title="Delete Permanently"><Trash2 size={14} /></button>
                                  </>
                                ) : (
                                  <button onClick={() => handleDeleteProduct(p.id)} style={{ color: 'var(--color-error)' }} title="Soft Delete"><X size={14} /></button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. ORDER PROGRESSION WORKFLOW */}
                {activeTab === 'orders' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                      <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Order progression & Logistics</h3>

                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                      {/* Left: Orders Table */}
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-bg-light)' }}>
                              <th style={{ padding: '10px' }}>Order ID</th>
                              <th style={{ padding: '10px' }}>Customer</th>
                              <th style={{ padding: '10px' }}>Amount</th>
                              <th style={{ padding: '10px' }}>Status</th>
                              <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(o => (
                              <tr 
                                key={o.id} 
                                onClick={() => setSelectedOrderForTimeline(o)}
                                style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: selectedOrderForTimeline?.id === o.id ? 'var(--color-primary-light)' : 'transparent' }}
                              >
                                <td style={{ padding: '10px' }}><strong>{o.id.toUpperCase()}</strong></td>
                                <td style={{ padding: '10px' }}>{o.customerName || o.name}<br/><span style={{ fontSize: '0.68rem', color: 'var(--color-text-light)' }}>{o.phone}</span></td>
                                <td style={{ padding: '10px' }}>₹{o.totalAmount || o.total}</td>
                                <td style={{ padding: '10px' }}>
                                  <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, backgroundColor: o.status === 'Pending' ? '#fef3c7' : o.status === 'Delivered' ? '#d1fae5' : o.status === 'Cancelled' ? '#fee2e2' : '#dbeafe', color: o.status === 'Pending' ? '#b45309' : o.status === 'Delivered' ? '#047857' : o.status === 'Cancelled' ? '#b91c1c' : '#1d4ed8' }}>
                                    {o.status}
                                  </span>
                                </td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                  <button onClick={(e) => { e.stopPropagation(); handlePrintInvoice(o); }} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                                    Invoice
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Right: Selected Order Timeline details */}
                      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff' }}>
                        {selectedOrderForTimeline ? (
                          <div>
                            <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                              Logistics Timeline: {selectedOrderForTimeline.id.toUpperCase()}
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              <strong>Address:</strong> {selectedOrderForTimeline.address}, {selectedOrderForTimeline.city} ({selectedOrderForTimeline.pincode})
                            </p>

                            {/* Timeline progression nodes */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                              {[
                                'Pending', 'Confirmed', 'Packed', 'Ready', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded'
                              ].map((step, idx) => {
                                const isCurrent = selectedOrderForTimeline.status === step;
                                const isPassed = ['Pending', 'Confirmed', 'Packed', 'Ready', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded'].indexOf(selectedOrderForTimeline.status) >= idx;

                                return (
                                  <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      backgroundColor: isCurrent ? 'var(--color-accent-yellow)' : isPassed ? 'var(--color-primary)' : 'var(--color-border)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontSize: '0.62rem',
                                      fontWeight: 700
                                    }}>
                                      {isPassed ? '✓' : idx + 1}
                                    </div>
                                    <span style={{ fontSize: '0.82rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                                      {step}
                                    </span>
                                    {isCurrent && (
                                      <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: 700 }}>Active status</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Transition button */}
                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', gap: '8px' }}>
                              {selectedOrderForTimeline.status === 'Pending' && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Confirmed')} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Confirm Order</button>
                              )}
                              {selectedOrderForTimeline.status === 'Confirmed' && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Packed')} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Pack Package</button>
                              )}
                              {selectedOrderForTimeline.status === 'Packed' && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Ready')} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Mark Ready for Dispatch</button>
                              )}
                              {selectedOrderForTimeline.status === 'Ready' && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Shipped')} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Ship Order</button>
                              )}
                              {selectedOrderForTimeline.status === 'Shipped' && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Delivered')} className="btn-accent" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Deliver</button>
                              )}
                              
                              {['Pending', 'Confirmed', 'Packed', 'Ready', 'Shipped'].includes(selectedOrderForTimeline.status) && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Cancelled')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>Cancel</button>
                              )}
                              {selectedOrderForTimeline.status === 'Delivered' && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Returned')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Accept Return</button>
                              )}
                              {selectedOrderForTimeline.status === 'Returned' && (
                                <button onClick={() => handleUpdateOrderStatus(selectedOrderForTimeline.id, 'Refunded')} className="btn-accent" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Issue Refund</button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '40px 0' }}>
                            <ShoppingBag size={34} style={{ display: 'block', margin: '0 auto 10px auto' }} />
                            <span>Select an order from the ledger list to track or transition delivery states.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. MARKETING COUPONS */}
                {activeTab === 'marketing' && (
                  <div>
                    <h3>Promotions &amp; Flash Sales</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
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
                                style={{ fontSize: '0.8rem', fontWeight: 700, color: coupon.active ? 'var(--color-success)' : 'var(--color-text-light)', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                {coupon.active ? 'Active' : 'Disabled'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={(e) => { e.preventDefault(); alert('Flash sale updated successfully! ✓'); }} className={styles.loginForm}>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Flash Sale Schedule</h4>
                        <div className={styles.formGroup}>
                          <label>Discount Rate (%)</label>
                          <input type="number" placeholder="e.g. 20" defaultValue="15" required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Countdown Date</label>
                          <input type="datetime-local" defaultValue="2026-07-15T23:59" required className={styles.input} />
                        </div>
                        <button type="submit" className="btn-accent" style={{ marginTop: '10px' }}>
                          Activate Flash Sale
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 5. STAFF MEMBER REGISTRY */}
                {activeTab === 'staff' && (
                  <div>
                    <h3>Staff Members Directory</h3>
                    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-bg-light)' }}>
                            <th style={{ padding: '10px' }}>Staff Name</th>
                            <th style={{ padding: '10px' }}>Email Address</th>
                            <th style={{ padding: '10px' }}>Assigned ERP Role</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Security Permissions Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Owner VBS', email: 'owner@vidhya.com', role: 'Owner' },
                            { name: 'Super Admin', email: 'admin@vidhya.com', role: 'Super Admin' },
                            { name: 'Inventory Chief', email: 'inventory@vidhya.com', role: 'Inventory Manager' },
                            { name: 'Sales Chief', email: 'sales@vidhya.com', role: 'Sales Manager' },
                            { name: 'Logistics Lead', email: 'delivery@vidhya.com', role: 'Delivery Manager' },
                            { name: 'Content Strategist', email: 'content@vidhya.com', role: 'Content Manager' },
                            { name: 'Growth Lead', email: 'marketing@vidhya.com', role: 'Marketing Manager' },
                            { name: 'Customer Care Specialist', email: 'support@vidhya.com', role: 'Customer Support' },
                            { name: 'Guest Auditor', email: 'viewer@vidhya.com', role: 'Viewer' }
                          ].map((staff, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '10px' }}><strong>{staff.name}</strong></td>
                              <td style={{ padding: '10px' }}>{staff.email}</td>
                              <td style={{ padding: '10px' }}>{staff.role}</td>
                              <td style={{ padding: '10px', textAlign: 'right', color: 'var(--color-success)', fontWeight: 600 }}>
                                Verified ✓
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. SEO CONFIGURATIONS */}
                {activeTab === 'seo' && (
                  <div className={styles.settingsConsole}>
                    <h3>SEO Configurations Console</h3>
                    <div className={styles.consoleRow}>
                      <label className={styles.consoleLabel}>Sitemap URL</label>
                      <input type="text" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.consoleRow}>
                      <label className={styles.consoleLabel}>Robots.txt Parameters</label>
                      <textarea value={robotsTxt} onChange={(e) => setRobotsTxt(e.target.value)} className={styles.consoleInput} style={{ minHeight: '80px', width: '100%' }} />
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
                      Save configurations
                    </button>
                  </div>
                )}

                {/* 7. CMS & CONTENT MANAGEMENTS */}
                {activeTab === 'content' && (
                  <div>
                    <h3>Bulletins &amp; Blogs Editorial</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                      {[
                        { title: 'MPPSC 2026 Prelims Strategy & Sourced Reference Guides', author: 'VBS Indore Team', date: 'July 10, 2026', views: 320 },
                        { title: 'Best Reference Books for Engineering DAVV Semester Exams', author: 'College Desk', date: 'July 05, 2026', views: 180 },
                        { title: 'Indore Study Hubs: Recommended Novels for Civil Services Aspirants', author: 'Guest Blogger', date: 'June 28, 2026', views: 245 }
                      ].map((b, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-light)' }}>
                          <div>
                            <strong style={{ fontSize: '0.88rem', color: 'var(--color-primary)' }}>{b.title}</strong>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                              Published by {b.author} | {b.date} | 👁 {b.views} reads
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. SYSTEM AUDIT LOGS & BACKUPS */}
                {activeTab === 'backup' && (
                  <div>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                      {/* Database Backups utility card */}
                      <div style={{ flex: 1, minWidth: '240px', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg-light)' }}>
                        <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, margin: '0 0 10px 0' }}><Database size={18} style={{ display: 'inline', marginRight: '6px' }} /> Database Snapshot Backups</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '8px 0 16px 0', lineHeight: 1.4 }}>
                          Download complete JSON records of catalog products, customer lists, and order ledgers.
                        </p>
                        <button onClick={handleCreateBackup} className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                          Create Snapshot Backup
                        </button>

                        <div style={{ marginTop: '20px', maxHeight: '180px', overflowY: 'auto' }}>
                          {backups.length === 0 ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>No backup files created yet.</span>
                          ) : (
                            backups.map(b => (
                              <div key={b.filename} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem' }}>
                                <span>{b.filename} ({b.size})</span>
                                <button onClick={() => handleRestoreBackup(b.filename)} style={{ color: 'var(--color-success)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Restore</button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Audit logs listing table */}
                      <div style={{ flex: 2, minWidth: '320px', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, margin: 0 }}><ShieldCheck size={18} style={{ display: 'inline', marginRight: '6px' }} /> ERP Audit Logs Logs</h4>

                        </div>

                        <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-light)' }}>
                                <th style={{ padding: '6px' }}>Timestamp</th>
                                <th style={{ padding: '6px' }}>Admin</th>
                                <th style={{ padding: '6px' }}>Action</th>
                                <th style={{ padding: '6px' }}>Detail</th>
                              </tr>
                            </thead>
                            <tbody>
                              {auditLogs.map(l => (
                                <tr key={l.id} style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                                  <td style={{ padding: '6px', whiteSpace: 'nowrap' }}>{new Date(l.timestamp).toLocaleTimeString('en-IN')}</td>
                                  <td style={{ padding: '6px' }}><strong>{l.adminName}</strong></td>
                                  <td style={{ padding: '6px' }}>{l.action}</td>
                                  <td style={{ padding: '6px', color: 'var(--color-text-muted)' }}>{l.newValue || l.oldValue}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </main>
            </div>
          )}
        </div>
      </section>

      {/* Product Add/Edit Modal (Detailed eCommerce Spec Sheet Form) */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} style={{ maxWidth: '850px', width: '95%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>
                {editingProduct ? 'Edit Catalog Product details' : 'Catalog New Book / Stationery Asset'}
              </h3>
              
              {/* Save status message indicator */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {saveStatus === 'saving' && <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}><RefreshCw size={12} className="animate-spin" /> Saving draft...</span>}
                {saveStatus === 'saved' && <span style={{ fontSize: '0.78rem', color: '#047857' }}><Check size={12} /> Draft Saved</span>}
                <button type="button" onClick={() => { setIsModalOpen(false); setIsDirty(false); }} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
            </div>
            
            <form onSubmit={handleSaveProduct} className={styles.loginForm} onChange={() => setIsDirty(true)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '10px' }}>
                
                {/* Left Form: Product specifications fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Basic Specifications */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Basic Information</span>
                    
                    <div className={styles.formGroup}>
                      <label>Title *</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.input} style={{ padding: '8px' }} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Subtitle / Exam Prep Description</label>
                      <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className={styles.formGroup}>
                        <label>Author / Speaker *</label>
                        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className={styles.input} style={{ padding: '8px' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Publisher *</label>
                        <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} required className={styles.input} style={{ padding: '8px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className={styles.formGroup}>
                        <label>ISBN-13 Code *</label>
                        <input 
                          type="text" 
                          value={isbn} 
                          onChange={(e) => setIsbn(e.target.value)} 
                          required 
                          className={styles.input} 
                          style={{ padding: '8px' }} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Barcode / GTIN</label>
                        <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div className={styles.formGroup}>
                        <label>Language</label>
                        <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Edition</label>
                        <input type="text" value={edition} onChange={(e) => setEdition(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Pub Date</label>
                        <input type="date" value={pubDate} onChange={(e) => setPubDate(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Brief Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} style={{ minHeight: '60px', padding: '8px' }} />
                    </div>
                  </div>

                  {/* Pricing specs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Pricing &amp; Taxation</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div className={styles.formGroup}>
                        <label>MRP (₹) *</label>
                        <input type="number" value={mrp} onChange={(e) => setMrp(e.target.value)} required className={styles.input} style={{ padding: '8px' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Selling Price (₹) *</label>
                        <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required className={styles.input} style={{ padding: '8px' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>GST Tax %</label>
                        <select value={gst} onChange={(e) => setGst(e.target.value)} className={styles.select} style={{ padding: '8px' }}>
                          <option value="5">5% (Books Standard)</option>
                          <option value="12">12% (Notebooks)</option>
                          <option value="18">18% (Luxury Stationery)</option>
                        </select>
                      </div>
                    </div>
                    {mrp && sellingPrice && (
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)' }}>
                        Discount: {Math.round(((Number(mrp) - Number(sellingPrice)) / Number(mrp)) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Warehousing details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Warehousing &amp; Inventory</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className={styles.formGroup}>
                        <label>SKU Code *</label>
                        <input 
                          type="text" 
                          value={sku} 
                          onChange={(e) => setSku(e.target.value)} 
                          required 
                          className={styles.input} 
                          style={{ padding: '8px' }} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Stock Count *</label>
                        <input type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} required className={styles.input} style={{ padding: '8px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className={styles.formGroup}>
                        <label>Low Stock Alert Level</label>
                        <input type="number" value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Shelf Location</label>
                        <input type="text" value={warehouseLocation} onChange={(e) => setWarehouseLocation(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Form: Categories, SEO and Uploads preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Image cover uploader drag and drop */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Cover Image Upload</span>
                    
                    <div 
                      style={{ border: '2px dashed var(--color-primary-medium)', padding: '20px', borderRadius: '6px', textAlign: 'center', backgroundColor: 'var(--color-bg-light)', cursor: 'pointer', position: 'relative' }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => handleUploadImage(reader.result as string, 'cover');
                          reader.readAsDataURL(file);
                        }
                      }}
                    >
                      <Upload size={22} style={{ display: 'block', margin: '0 auto 6px auto', color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Drag Cover File Here or Click to Browse</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => handleUploadImage(reader.result as string, 'cover');
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                      />
                    </div>

                    {/* Crop, Rotate, Zoom controls */}
                    {image && (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                        <button type="button" onClick={() => setImageRotation(prev => (prev + 90) % 360)} className="btn-secondary" style={{ padding: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}><RotateCw size={12} /> Rotate</button>
                        <button type="button" onClick={() => setImageZoom(prev => Math.min(prev + 0.1, 2))} className="btn-secondary" style={{ padding: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ZoomIn size={12} /> Zoom +</button>
                        <button type="button" onClick={() => setImageZoom(prev => Math.max(prev - 0.1, 0.5))} className="btn-secondary" style={{ padding: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ZoomOut size={12} /> Zoom -</button>
                      </div>
                    )}

                    {uploadProgress > 0 && (
                      <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden', marginTop: '10px' }}>
                        <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                      </div>
                    )}

                    {/* Previews Row */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      {image && (
                        <div style={{ textAlign: 'center' }}>
                          <img src={image} alt="Cover" style={{ width: '48px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)', transform: `rotate(${imageRotation}deg) scale(${imageZoom})` }} />
                          <span style={{ fontSize: '0.62rem', display: 'block', color: 'var(--color-text-muted)' }}>Cover Preview</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Categories &amp; Tags</span>
                    <div className={styles.formGroup}>
                      <label>Primary Category *</label>
                      <select value={primaryCategory} onChange={(e) => setPrimaryCategory(e.target.value)} className={styles.select} style={{ padding: '8px' }}>
                        <option value="Competitive Exams">Competitive Exams</option>
                        <option value="Academic Textbooks">Academic Textbooks</option>
                        <option value="Novels & Literature">Novels & Literature</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Used Books">Used Books</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Subcategory (e.g. UPSC, MPPSC, CBSE)</label>
                      <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Tags (comma separated)</label>
                      <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. mppsc, laxmikanth, polity" className={styles.input} style={{ padding: '8px' }} />
                    </div>
                  </div>

                  {/* SEO meta data configurations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>SEO Metadata Options</span>
                    
                    <div className={styles.formGroup}>
                      <label>Meta Title</label>
                      <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Meta Description</label>
                      <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={styles.textarea} style={{ minHeight: '50px', padding: '8px' }} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>URL Slug Identifier</label>
                      <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={styles.input} style={{ padding: '8px' }} />
                    </div>
                  </div>

                  {/* Badges visibility */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Storefront Visibility Status</span>
                    
                    <div className={styles.formGroup}>
                      <label>Visibility Status</label>
                      <select value={visibility} onChange={(e) => setVisibility(e.target.value as any)} className={styles.select} style={{ padding: '8px' }}>
                        <option value="Published">Published (Active in Shop)</option>
                        <option value="Draft">Draft (Hidden in Shop)</option>
                        <option value="Hidden">Hidden (Archived)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                        <span>Display on Homepage Banner</span>
                      </label>
                      <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                        <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />
                        <span>Featured Bestseller Badge</span>
                      </label>
                      <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                        <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
                        <span>New Arrival Badge</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              <div className={styles.modalActions} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => { setIsModalOpen(false); setIsDirty(false); }} className={styles.modalCancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn} disabled={isLoading}>
                  {isLoading ? 'Saving Changes...' : 'Commit Database Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Stock Adjustments Ledger Modal */}
      {isLedgerModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} style={{ maxWidth: '420px' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Adjust Warehouse Stock Ledger</h3>
            </div>
            <form onSubmit={handleSaveStockLedger} className={styles.loginForm} style={{ marginTop: '14px' }}>
              <div className={styles.formGroup}>
                <label>Select Catalog Item *</label>
                <select 
                  value={ledgerProductId} 
                  onChange={(e) => setLedgerProductId(e.target.value)} 
                  required 
                  className={styles.select}
                >
                  <option value="">Choose book...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} (Stock: {p.stockCount})</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                <label>Ledger Action Type *</label>
                <select 
                  value={ledgerAction} 
                  onChange={(e) => setLedgerAction(e.target.value as any)} 
                  required 
                  className={styles.select}
                >
                  <option value="Purchase">Purchase Entry (Stock Increase)</option>
                  <option value="Increase">Manual Increase</option>
                  <option value="Returned">Customer Returned Items</option>
                  <option value="Decrease">Manual Decrease</option>
                  <option value="Damage">Damage write-off</option>
                  <option value="Lost">Lost assets</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                <label>Quantity *</label>
                <input 
                  type="number" 
                  value={ledgerQty} 
                  onChange={(e) => setLedgerQty(e.target.value)} 
                  required 
                  min={1} 
                  className={styles.input} 
                />
              </div>

              <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                <label>Reason / Comments *</label>
                <input 
                  type="text" 
                  value={ledgerReason} 
                  onChange={(e) => setLedgerReason(e.target.value)} 
                  required 
                  placeholder="e.g. Sourced from McGraw Hill" 
                  className={styles.input} 
                />
              </div>

              <div className={styles.modalActions} style={{ marginTop: '20px' }}>
                <button type="button" onClick={() => setIsLedgerModalOpen(false)} className={styles.modalCancelBtn}>Cancel</button>
                <button type="submit" className={styles.modalSaveBtn} disabled={isLoading}>{isLoading ? 'Posting...' : 'Post Stock Entry'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
