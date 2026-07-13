'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, X, CheckSquare, Calendar, Sparkles, BookOpen, Compass, ClipboardList } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  stockCount: number;
}


interface PlannerGoal {
  id: string;
  text: string;
  completed: boolean;
}

const initialGoals: PlannerGoal[] = [
  { id: '1', text: 'Read Laxmikanth Indian Polity Chapter 5', completed: false },
  { id: '2', text: 'Solve 20 MPPSC Geography Mock Questions', completed: false },
  { id: '3', text: 'Revise current affairs bulletins for Indore region', completed: false }
];

export default function StudentHub() {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [goals, setGoals] = useState<PlannerGoal[]>([]);
  const [newGoalText, setNewGoalText] = useState('');
  
  // AI book recommender target selection
  const [aiExamSelect, setAiExamSelect] = useState<'mppsc' | 'upsc' | 'stationery'>('mppsc');
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // Load goals from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vbs_student_goals');
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      setGoals(initialGoals);
    }
  }, []);

  // Fetch recommendations based on category
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch('/api/products?limit=20');
        if (res.ok) {
          const data = await res.json();
          const all = data.products || [];
          let filtered: any[] = [];
          if (aiExamSelect === 'mppsc') {
            filtered = all.filter((p: any) => p.subcategory?.toLowerCase().includes('mppsc') || p.title.toLowerCase().includes('mppsc'));
          } else if (aiExamSelect === 'upsc') {
            filtered = all.filter((p: any) => p.subcategory?.toLowerCase().includes('upsc') || p.title.toLowerCase().includes('upsc'));
          } else {
            filtered = all.filter((p: any) => p.category === 'Stationery');
          }
          setRecommendedProducts(filtered.slice(0, 2));
        }
      } catch (err) {
        console.error('Error loading recommendations:', err);
      }
    };
    fetchRecs();
  }, [aiExamSelect]);

  const saveGoals = (updated: PlannerGoal[]) => {
    setGoals(updated);
    localStorage.setItem('vbs_student_goals', JSON.stringify(updated));
  };

  const handleToggleGoal = (id: string) => {
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    saveGoals(updated);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal: PlannerGoal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      completed: false
    };
    saveGoals([...goals, newGoal]);
    setNewGoalText('');
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
  };

  return (
    <>
      {/* Floating student hub entry button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Student Hub Dashboard"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#213D8F',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px',
          padding: '12px 20px',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(33, 61, 143, 0.4)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          transition: 'transform 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <GraduationCap size={18} />
        <span>Student Hub 📚</span>
      </button>

      {/* Slide-out Drawer Panel overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 100000,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '440px',
            height: '100%',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideLeft 0.3s ease-out'
          }}>
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={22} style={{ color: 'var(--color-accent-yellow)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Indore Aspirant Hub</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ border: 'none', background: 'transparent', color: '#ffffff', cursor: 'pointer' }}
                aria-label="Close Student Hub Dashboard"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* 1. Countdown Timers */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
                  <Calendar size={15} /> Indore Exam Countdown Timers
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>MPPSC Prelims 2026</span>
                    <strong style={{ fontSize: '1.2rem', color: '#b45309', display: 'block', marginTop: '2px' }}>124 Days</strong>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>UPSC Prelims 2026</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--color-primary)', display: 'block', marginTop: '2px' }}>180 Days</strong>
                  </div>
                </div>
              </div>

              {/* 2. Daily goal planner */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
                  <ClipboardList size={15} /> Daily study planner checklist
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {goals.map(g => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 10px', borderRadius: '4px', backgroundColor: g.completed ? '#ecfdf5' : '#f8fafc', border: '1px solid var(--color-border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem', color: g.completed ? '#065f46' : 'var(--color-text-main)', textDecoration: g.completed ? 'line-through' : 'none', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={g.completed} 
                          onChange={() => handleToggleGoal(g.id)} 
                          style={{ accentColor: 'var(--color-success)' }} 
                        />
                        <span>{g.text}</span>
                      </label>
                      <button 
                        onClick={() => handleDeleteGoal(g.id)}
                        style={{ border: 'none', background: 'transparent', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.7rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Add a new target goal..."
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      fontSize: '0.78rem'
                    }}
                  />
                  <button 
                    type="submit"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* 3. Daily Current affairs bullets */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                  <BookOpen size={15} /> Daily Current Affairs Bulletins
                </h4>
                <ul style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', paddingLeft: '20px', lineHeight: 1.5, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Cabinet approves ₹500 Cr textbooks scheme to support college libraries.</li>
                  <li>MPPSC 2026 syllabus amendments published; focus on state economy history.</li>
                  <li>Vidhya Book Store Indore branch announces student desk pickup service is active.</li>
                </ul>
              </div>

              {/* 4. AI Book advisor */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                  <Sparkles size={15} style={{ color: '#eab308' }} /> VBS AI Book Recommendations
                </h4>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  {['mppsc', 'upsc', 'stationery'].map(type => (
                    <button
                      key={type}
                      onClick={() => setAiExamSelect(type as any)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: aiExamSelect === type ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: aiExamSelect === type ? 'var(--color-primary-light)' : '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recommendedProducts.map(p => (
                    <div key={p.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '6px' }}>
                      <img src={p.image} alt={p.title} style={{ width: '32px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '2px', display: 'block' }}>₹{p.price}</span>
                      </div>
                      <button
                        onClick={() => {
                          addToCart(p);
                          alert(`Added "${p.title}" to cart!`);
                        }}
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
