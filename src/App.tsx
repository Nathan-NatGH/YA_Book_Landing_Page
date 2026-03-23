/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, User, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

const coverImage = '/cover.jpg';

// Error Boundary Component
interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends (React.Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05070A] text-[#F8FAFC] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-6">
            <AlertCircle className="w-16 h-16 text-[#EF4444] mx-auto" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-slate-400">
              We encountered an unexpected error. Please refresh the page or try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#F8FAFC] text-[#05070A] font-bold py-4 rounded-2xl hover:bg-[#3B82F6] hover:text-white transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const testimonials = [
  {
    name: "Sarah J.",
    text: "The drama is so thick you can cut it with a knife. I'm obsessed with Janice's journey.",
    role: "Verified Reader"
  },
  {
    name: "Marcus T.",
    text: "Nia Monroe has a way of making you feel every secret. Part 2 is the only thing I'm waiting for.",
    role: "Book Blogger"
  },
  {
    name: "Elena R.",
    text: "A masterclass in suspense and urban drama. I finished Part 1 in one sitting!",
    role: "Verified Reader"
  },
  {
    name: "David K.",
    text: "If you think you know where this is going, you're wrong. The ending changed everything.",
    role: "Urban Fiction Fan"
  }
];

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const leadDocRef = doc(db, 'leads', normalizedEmail);
      
      await setDoc(leadDocRef, {
        email: normalizedEmail,
        first_name: firstName,
        createdAt: serverTimestamp()
      }, { merge: true });

      setStatus('success');
      setFirstName('');
      setEmail('');
    } catch (err: any) {
      console.error("Submission error:", err);
      setStatus('error');
      
      let message = 'Something went wrong. Please try again.';
      
      // Check if it's our JSON error from handleFirestoreError
      try {
        const parsedError = JSON.parse(err.message);
        if (parsedError.error) {
          message = `Database Error: ${parsedError.error}`;
        }
      } catch {
        // Not a JSON error, use original message if it's simple
        if (err.message && err.message.length < 100) {
          message = err.message;
        }
      }

      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#F8FAFC] font-sans selection:bg-[#3B82F6]/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#3B82F6]/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-[#EF4444]/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Visuals */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group flex flex-col space-y-4"
        >
          <h2 className="text-[#3B82F6] font-mono text-sm tracking-[0.2em] uppercase text-center">Nia Monroe Presents</h2>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6] to-[#EF4444] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-[2/3] w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-slate-900">
            <img 
              src={coverImage} 
              alt="You Ain't The Only One Book Cover"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onLoad={() => console.log('Image loaded successfully')}
              onError={(e) => {
                console.error('Image failed to load:', e);
                const target = e.target as HTMLImageElement;
                console.log('Current src:', target.src);
              }}
            />
            {/* Overlay for mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent opacity-60"></div>
            
            {/* Floating Badge */}
            <a 
              href="https://a.co/d/0aKwHSW6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg transition-all hover:bg-black/60 hover:scale-[1.02] group/badge"
            >
              <p className="text-xs uppercase tracking-widest text-[#3B82F6] font-bold mb-1 flex items-center justify-between">
                Part 1 Available on Amazon
                <ChevronRight className="w-4 h-4 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
              </p>
              <p className="text-sm text-slate-300 italic">"The secret is out, and it's louder than you think."</p>
            </a>
          </div>
        </div>
      </motion.div>

        {/* Right Column: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
              You Ain't <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] to-[#94A3B8]">The Only One</span>
            </h1>
          </div>

          <div className="space-y-6 text-lg text-slate-400 leading-relaxed translate-y-[2px]">
            <p>
              Janice had the secrets. The secret texts, the secret smiles, and the secret stolen moments with her best friend's man. She thought she was the only one who could pull it off.
            </p>
            <p>
              Jonathan had the game. Two girls, one lie, and zero effort. He thought he was the only one calling the shots.
            </p>
            <p>
              But when the truth hits the feed, they’ll all realize...
            </p>
            <p>
              Don't trust the rumors. Enter your email to get the Part 2 release alert and exclusive sequel updates delivered the second they drop.
            </p>
          </div>

          {/* Signup Form */}
          <div className="pt-4">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 p-6 rounded-2xl flex items-start space-x-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#3B82F6] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg">We got you.</h3>
                    <p className="text-slate-400">You're on the list for Part 2 updates.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#3B82F6] transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#3B82F6] transition-colors" />
                    <input 
                      type="email" 
                      required
                      placeholder="Fill it to spill it"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all placeholder:text-slate-600"
                    />
                  </div>
                  
                  <button 
                    disabled={status === 'loading'}
                    className="w-full bg-[#F8FAFC] text-[#05070A] font-bold py-4 rounded-2xl flex items-center justify-center hover:bg-[#3B82F6] hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#3B82F6]/10"
                  >
                    <span className="flex items-center">
                      {status === 'loading' ? 'Processing...' : 'ADD ME'}
                      {status !== 'loading' && <ChevronRight className="ml-1 w-5 h-5" />}
                    </span>
                  </button>

                  {status === 'error' && (
                    <div className="flex items-center space-x-2 text-[#EF4444] text-sm px-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">What Readers Are Saying</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The rumors are true. Readers everywhere are losing their minds over Part 1.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 hover:bg-white/[0.07] transition-colors group"
              >
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-[#3B82F6] rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
                  ))}
                </div>
                <p className="text-slate-300 italic leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-bold text-[#F8FAFC]">{t.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-12 border-t border-white/5 text-center">
        <p className="text-xs text-slate-600 uppercase tracking-[0.3em]">
          &copy; 2026 Nia Monroe. All Rights Reserved.
        </p>
      </footer>

      {/* Floating Elements for visual interest */}
      <div className="fixed bottom-10 right-10 hidden lg:block">
        <div className="w-24 h-24 border border-white/5 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 border border-[#3B82F6]/20 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
