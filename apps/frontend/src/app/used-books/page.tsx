'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BookOpen, Upload, Camera, CheckCircle2, ShieldCheck, X } from 'lucide-react';

type BookCondition = 'Like New' | 'Very Good' | 'Good' | 'Acceptable';

export default function UsedBooksPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [condition, setCondition] = useState<BookCondition>('Very Good');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [examTag, setExamTag] = useState('UPSC');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && expectedPrice && phone) {
      setSubmitted(true);
      alert(`Used book consignment registered! Title: "${title}". Our Bhanwarkuan store evaluator will inspect your listing and send a purchase offer to your phone/WhatsApp within 2 hours. ✓`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            📚 Secondhand Buyback Program
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sell Used Books to Vidhya Book Store
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
            Clean out your bookshelves! Sell your old UPSC, MPPSC coaching sets, CBSE guides, or engineering textbooks and get instant cash or wallet store credits.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase">Book Details</h3>
              <p className="text-xxs text-slate-400 mt-0.5">Please provide accurate description to speed up quote approval.</p>
            </div>

            {/* Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Book/Notes Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lakshmikanth Indian Polity 6th Ed"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Author Name *</label>
                <input
                  type="text"
                  placeholder="e.g. M. Laxmikanth"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* ISBN & Exam Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">ISBN Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 9789357412351"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Target Exam / Board *</label>
                <select
                  value={examTag}
                  onChange={(e) => setExamTag(e.target.value)}
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none bg-white font-semibold text-slate-700"
                >
                  <option value="UPSC">UPSC Civil Services</option>
                  <option value="MPPSC">MPPSC State Board</option>
                  <option value="CBSE">CBSE Class 10/12</option>
                  <option value="JEE">JEE Mains/Advanced</option>
                  <option value="NEET">NEET Medical</option>
                  <option value="Engineering">Engineering / College</option>
                </select>
              </div>
            </div>

            {/* Condition & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Book Condition *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as BookCondition)}
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none bg-white font-semibold text-slate-700"
                >
                  <option value="Like New">Like New (Unmarked pages, crisp binding)</option>
                  <option value="Very Good">Very Good (Minimal highlightings)</option>
                  <option value="Good">Good (Readable text, normal cover creases)</option>
                  <option value="Acceptable">Acceptable (Significant wear, fully complete pages)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Expected Buyback Quote (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 350"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  required
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Contact Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Student Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="student@gmail.com"
                  className="text-xs p-3 border border-slate-200 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Image photo upload drag drop */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Upload Cover & Page Photos *</label>
              
              {imagePreview ? (
                <div className="border border-slate-200 rounded p-4 relative flex flex-col items-center bg-slate-50">
                  <img src={imagePreview} className="h-32 object-contain rounded" />
                  <button 
                    type="button" 
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <span className="text-xxs text-slate-400 mt-2 font-bold">Photo attached for evaluation</span>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    const mockUrls = [
                      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
                      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400'
                    ];
                    setImagePreview(mockUrls[Math.floor(Math.random() * mockUrls.length)]);
                  }}
                  className="border-2 border-dashed border-slate-200 hover:border-primary rounded-lg p-8 text-center bg-slate-50 hover:bg-primary-light/5 cursor-pointer smooth-transition"
                >
                  <Camera className="text-slate-400 mx-auto mb-2" size={24} />
                  <span className="text-xs font-bold text-slate-600 block">Click to upload cover photo</span>
                  <span className="text-xxs text-slate-400 block mt-1">Accepts PNG, JPG up to 10MB</span>
                </div>
              )}
            </div>

            {/* Terms check */}
            <div className="flex items-start gap-2 pt-2">
              <ShieldCheck className="text-primary flex-shrink-0 mt-0.5" size={16} />
              <p className="text-xxs text-slate-500 leading-relaxed">
                By submitting this request, you verify that the books are original publications, contain no missing chapters, and correspond to the specified syllabus codes. Final evaluation is conducted offline at the Bhanwarkuan branch.
              </p>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-md transition-all shadow-md flex items-center justify-center gap-1.5">
              Submit Buyback Proposal
            </button>

          </form>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center shadow-sm max-w-xl mx-auto">
            <CheckCircle2 className="text-emerald-500 mx-auto mb-4 animate-bounce" size={48} />
            <h2 className="text-xl font-extrabold text-slate-900">Consignment Request Filed</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              We have received your secondhand book details. Our store evaluation assistant will verify the photos against the current curriculum syllabus and contact you at <strong>{phone || '9752809717'}</strong> to align on the buyback quote.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
                Sell Another Book
              </button>
              <Link href="/books" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
                Go to Catalog
              </Link>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
