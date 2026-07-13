'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, ShieldCheck, ShoppingCart, Heart, Share2, 
  Truck, HelpCircle, Gift, Sparkles, Sun, Moon, Bell, CheckCircle, MapPin
} from 'lucide-react';
import PreviewModal from './PreviewModal';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  title: string;
  author: string;
  publisher: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isbn: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
}

export default function ProductClientWrapper({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'ship' | 'pickup'>('ship');
  const [stockAlertEmail, setStockAlertEmail] = useState('');
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const [preOrderPlaced, setPreOrderPlaced] = useState(false);
  
  // Pincode Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'indore' | 'outside' | 'invalid'>('idle');

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Bundle calculations
  const [notebookSelected, setNotebookSelected] = useState(true);
  const bundleTotal = product.price + (notebookSelected ? 120 : 0) + (giftWrap ? 30 : 0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vbs_wishlist');
      if (stored) {
        const items = JSON.parse(stored) as Product[];
        setIsWishlisted(items.some(item => item.id === product.id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const toggleWishlist = () => {
    try {
      const stored = localStorage.getItem('vbs_wishlist');
      let items: Product[] = [];
      if (stored) {
        items = JSON.parse(stored) as Product[];
      }
      const exists = items.some(item => item.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = items.filter(item => item.id !== product.id);
        setIsWishlisted(false);
      } else {
        updated = [...items, product as any];
        setIsWishlisted(true);
      }
      localStorage.setItem('vbs_wishlist', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus('invalid');
      return;
    }
    if (pincode.startsWith('452')) {
      setPincodeStatus('indore');
    } else {
      setPincodeStatus('outside');
    }
  };

  const handleStockAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockAlertEmail.trim()) {
      setAlertSubmitted(true);
      alert(`Back-in-stock alert registered for: ${stockAlertEmail}! We will notify you on WhatsApp (8982883332) & email when restocked. ✓`);
    }
  };

  // Specifications
  const specs = [
    { name: 'ISBN-13', value: product.isbn || '978-93-87625-10-2' },
    { name: 'Publisher', value: product.publisher || 'Vidhya Publications' },
    { name: 'Edition', value: '2026 Latest Edition' },
    { name: 'Language', value: 'Bilingual (English/Hindi)' },
    { name: 'Pages', value: '480 Pages' },
    { name: 'Binding', value: 'Paperback' },
    { name: 'Weight', value: '520 grams' },
    { name: 'Dimensions', value: '18 x 2.2 x 24 cm' }
  ];

  return (
    <div className={`smooth-transition ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} min-h-screen py-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dark Mode toggle & Premium toolbar */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold text-slate-400">Premium Reading Lounge</span>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full border transition-all ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Details Grid */}
        <div className={`border rounded-lg p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Cover image Column */}
          <div className="flex flex-col items-center">
            <div className={`relative flex justify-center items-center rounded-lg p-6 border w-full aspect-[4/5] overflow-hidden ${
              isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-100/50 border-slate-100'
            }`}>
              <img 
                src={product.image} 
                alt={product.title} 
                className="max-h-96 object-contain rounded shadow-lg hover:scale-110 transition-transform duration-300 cursor-zoom-in"
                loading="lazy"
              />
              <span className="absolute bottom-4 right-4 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded">
                🔎 Hover to Zoom | 360° Available
              </span>
            </div>
            
            {/* Action buttons under image */}
            <div className="flex gap-4 w-full mt-4 justify-center">
              <PreviewModal />
              <button 
                type="button" 
                onClick={toggleWishlist}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors"
              >
                <Heart size={14} fill={isWishlisted ? 'var(--color-error)' : 'none'} className={isWishlisted ? 'text-rose-500' : ''} />
                <span>{isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Context Column */}
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase text-primary bg-primary-light px-3 py-1 rounded-full self-start mb-4">
              {product.category}
            </span>
            
            <h1 className={`text-3xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {product.title}
            </h1>
            
            <p className="mt-2 text-slate-400 text-sm">
              By <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{product.author}</strong> | Publisher: <strong>{product.publisher}</strong>
            </p>

            <div className="flex items-center gap-1.5 mt-3 text-amber-500">
              <Star size={16} fill="currentColor" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{product.rating}</span>
              <span className="text-xs text-slate-400 font-semibold">({product.reviewCount || 24} Verified Student Reviews)</span>
            </div>

            <p className={`mt-6 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {product.description}
            </p>

            {/* Pincode Delivery Checker */}
            <div className="mt-6 border-t pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Check Delivery Pincode</span>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode..."
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className={`text-xs p-2.5 border rounded w-48 focus:ring-1 focus:ring-primary focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
                <button type="submit" className="bg-primary text-white text-xs font-bold px-4 rounded hover:bg-primary-hover transition-all">
                  Check
                </button>
              </form>

              {pincodeStatus === 'indore' && (
                <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                  <Truck size={14} /> 🚚 Super Fast Same-Day Delivery available in Indore! COD available.
                </p>
              )}
              {pincodeStatus === 'outside' && (
                <p className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1">
                  <Truck size={14} /> 📦 Delivery in 2-3 days via Registered Speed Post.
                </p>
              )}
              {pincodeStatus === 'invalid' && (
                <p className="text-xs text-rose-500 font-bold mt-2">
                  ❌ Please enter a valid 6-digit Indian Pincode.
                </p>
              )}
            </div>

            {/* Delivery Pickup Selection */}
            <div className="mt-6 border-t pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Delivery Preference</span>
              <div className="flex gap-4">
                <label className={`flex items-center gap-2 border p-3 rounded-md cursor-pointer flex-1 transition-all ${
                  deliveryMode === 'ship' ? 'border-primary bg-primary-light/10' : 'border-slate-200 hover:bg-slate-100/50'
                }`}>
                  <input type="radio" checked={deliveryMode === 'ship'} onChange={() => setDeliveryMode('ship')} className="text-primary" />
                  <div className="text-left">
                    <strong className="text-xs block">Runner Delivery</strong>
                    <span className="text-xxs text-slate-400">Same-Day in Indore Hostels</span>
                  </div>
                </label>

                <label className={`flex items-center gap-2 border p-3 rounded-md cursor-pointer flex-1 transition-all ${
                  deliveryMode === 'pickup' ? 'border-primary bg-primary-light/10' : 'border-slate-200 hover:bg-slate-100/50'
                }`}>
                  <input type="radio" checked={deliveryMode === 'pickup'} onChange={() => setDeliveryMode('pickup')} className="text-primary" />
                  <div className="text-left">
                    <strong className="text-xs block">Store Pickup</strong>
                    <span className="text-xxs text-slate-400">Bhanwarkuan Shop (Free)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Gift wrap checkbox */}
            <div className="mt-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={giftWrap} 
                  onChange={(e) => setGiftWrap(e.target.checked)} 
                  className="rounded border-slate-300 text-primary" 
                />
                <Gift size={14} className="text-primary" /> Add Premium Gift Wrapping (+₹30)
              </label>
            </div>

            {/* Price Box */}
            <div className={`mt-6 p-4 border rounded-lg flex items-center justify-between ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase">Student Offer</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-primary">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold block text-slate-500">Inventory Status</span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded mt-1.5 inline-block ${
                  product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {product.inStock ? 'Available' : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Checkout / Preorder / Alert Form */}
            <div className="mt-8">
              {product.inStock ? (
                preOrderPlaced ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-md flex items-center gap-2 text-xs font-bold">
                    <CheckCircle size={16} /> Pre-order placement registered successfully!
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => addToCart(product as any)}
                      className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-md transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                    {product.stockCount === 0 && (
                      <button 
                        onClick={() => setPreOrderPlaced(true)}
                        className="bg-accent-yellow hover:bg-accent-yellow-hover text-slate-900 font-bold py-3 px-6 rounded-md transition-all shadow-sm"
                      >
                        Reserve/Pre-Order
                      </button>
                    )}
                  </div>
                )
              ) : (
                <div>
                  <span className="text-xs font-bold text-rose-500 block mb-2">Currently out of stock at Bhanwarkuan</span>
                  {!alertSubmitted ? (
                    <form onSubmit={handleStockAlertSubmit} className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="Enter email for Restock Alerts..." 
                        value={stockAlertEmail}
                        onChange={(e) => setStockAlertEmail(e.target.value)}
                        required
                        className={`text-xs p-2.5 border rounded flex-1 focus:ring-1 focus:ring-primary focus:outline-none ${
                          isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      />
                      <button type="submit" className="bg-primary text-white text-xs font-bold px-4 rounded hover:bg-primary-hover transition-all flex items-center gap-1">
                        <Bell size={12} /> Restock Alert
                      </button>
                    </form>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 text-primary p-3 rounded-md flex items-center gap-2 text-xs font-bold">
                      <CheckCircle size={16} /> Back-in-stock alert registered successfully!
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Specifications Section */}
        <div className={`mt-8 border rounded-lg p-6 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4">
            📚 Product Specifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specs.map((spec, idx) => (
              <div key={idx} className="border-b pb-2">
                <span className="text-xxs text-slate-400 block font-semibold uppercase">{spec.name}</span>
                <strong className={`text-xs block mt-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{spec.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Bought Together Bundle Deals */}
        <div className={`mt-8 border rounded-lg p-6 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-accent-yellow" /> Frequently Bought Together (Bundle Deals)
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={product.image} className="w-16 h-20 object-contain border border-slate-200 p-1 bg-white rounded" />
              <span className="font-bold">+</span>
              <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200" className="w-16 h-20 object-contain border border-slate-200 p-1 bg-white rounded" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer mb-1 justify-center sm:justify-start">
                <input type="checkbox" checked={notebookSelected} onChange={(e) => setNotebookSelected(e.target.checked)} className="rounded" />
                <span>Add Premium 200-Page Classmate Register (+₹120)</span>
              </label>
              <p className="text-xxs text-slate-400">Get discounted bundle pricing with official store ribbon wrappers.</p>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-xs text-slate-400 font-semibold">Total Price:</div>
              <div className="font-extrabold text-primary text-xl">₹{bundleTotal}</div>
              <button 
                onClick={() => addToCart({ ...product, price: bundleTotal } as any)}
                className="bg-accent-yellow hover:bg-accent-yellow-hover text-slate-900 text-xs font-bold px-4 py-2 rounded mt-2 shadow-sm"
              >
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Verified Reviews Section */}
        <div className={`mt-8 border rounded-lg p-6 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-6">
            💬 Verified Student Reviews
          </h3>
          <div className="flex flex-col gap-6">
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-xs block text-slate-800 dark:text-slate-200">Rahul Sharma</strong>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">✓ Verified MPPSC Aspirant</span>
                </div>
                <div className="flex text-amber-500 gap-0.5">
                  <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">"Best book for MPPSC prelims preparation. The mapping details are excellent!"</p>
            </div>
            <div className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-xs block text-slate-800 dark:text-slate-200">Priya Patel</strong>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">✓ Verified Student</span>
                </div>
                <div className="flex text-amber-500 gap-0.5">
                  <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={10} />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">"Highly structured notes. Delivered same day to my library desk at Bhanwarkuan."</p>
            </div>
          </div>
        </div>

        {/* AI Reading Recommendations Engine */}
        <div className={`mt-8 border rounded-lg p-6 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
            🤖 AI Smart Reading Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 border rounded flex items-center gap-4 ${
              isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="bg-primary/10 text-primary text-xxs font-extrabold px-2.5 py-1.5 rounded-full">99% Match</div>
              <div>
                <strong className="text-xs block">Objective Indian Polity</strong>
                <span className="text-xxs text-slate-400 block mt-0.5">By M. Laxmikanth | McGraw Hill</span>
                <span className="text-xxs text-primary font-bold mt-1 block hover:underline cursor-pointer">View Book</span>
              </div>
            </div>

            <div className={`p-4 border rounded flex items-center gap-4 ${
              isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="bg-primary/10 text-primary text-xxs font-extrabold px-2.5 py-1.5 rounded-full">96% Match</div>
              <div>
                <strong className="text-xs block">Our Constitution</strong>
                <span className="text-xxs text-slate-400 block mt-0.5">By Subhash C. Kashyap | National Book Trust</span>
                <span className="text-xxs text-primary font-bold mt-1 block hover:underline cursor-pointer">View Book</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
