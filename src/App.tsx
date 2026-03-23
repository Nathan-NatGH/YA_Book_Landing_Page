/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ChevronRight, CheckCircle2, AlertCircle, BookOpen, Tablet } from 'lucide-react';
import coverImage from './assets/cover.jpg';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://erdbahuczgjgcvlylpna.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_6c2Rd92lLqrDf73u2L-vSw__daS9VZW";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Insert into Supabase
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([{ email }]);

      if (supabaseError) throw supabaseError;

      // 2. Trigger Resend Email via our API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send welcome email');
      }

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
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
                    <h3 className="font-bold text-lg">You're in.</h3>
                    <p className="text-slate-400">Check your inbox. The truth is waiting for you.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  exit={{ opacity: 0, y: -10 }}
                >
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

          {/* Social Proof / Footer */}
          <div className="pt-8 flex flex-col space-y-6">
            <div className="flex items-center justify-between w-full">
              <a href="#" className="text-slate-500 hover:text-[#3B82F6] transition-colors flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">Read Excerpt</span>
              </a>
              
              <a href="#" className="text-slate-500 hover:text-[#3B82F6] transition-colors">
                <span className="text-sm font-medium">Testimonials</span>
              </a>
            </div>
            <p className="text-xs text-slate-600 uppercase tracking-widest">
              &copy; 2026 Nia Monroe. All Rights Reserved.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Floating Elements for visual interest */}
      <div className="fixed bottom-10 right-10 hidden lg:block">
        <div className="w-24 h-24 border border-white/5 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 border border-[#3B82F6]/20 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
