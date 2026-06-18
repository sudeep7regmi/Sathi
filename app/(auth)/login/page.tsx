'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function LoginPage() {
  const router = useRouter();
  
  // 1. Unified state for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Track changes manually as the user types
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Simple raw frontend validation check
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/login', formData);
      
      if (response.data.success) {
        const role = response.data.role;
        // Direct users straight to their specific system dashboard
        if (role === 'PLAYER') router.push('/player');
        if (role === 'OWNER') router.push('/owner');
        if (role === 'ADMIN') router.push('/admin');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Invalid email or password."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen flex flex-col items-center justify-center p-6 selection:bg-[#C8F55A] selection:text-black relative overflow-hidden py-16">
      {/* Background glow node matching home environment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <Link href="/" className="text-[#C8F55A] text-2xl tracking-tight mb-6 z-10" style={DISPLAY}>
        SATHI<span className="text-white/40">.app</span>
      </Link>

      <div className="relative z-10 bg-[#12161A] border border-white/5 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-[#F0EDE6] uppercase tracking-wide mb-2" style={DISPLAY}>
            Welcome Back
          </h1>
          <p className="text-white/50 text-sm">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="m.bhujel@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all"
            />
          </div>

          <div>
            <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all"
            />
          </div>
          
          {error && (
            <p className="text-sm font-medium text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 rounded-xl">
              {error}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8F55A] text-[#111] py-3.5 rounded-xl text-base font-bold tracking-wider uppercase hover:bg-[#A8D448] active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-[#C8F55A]/5 mt-4"
            style={DISPLAY}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm">
          <span className="text-white/40">Don&apos;t have an account? </span>
          <Link href="/register" className="text-[#C8F55A] font-semibold hover:underline decoration-1 underline-offset-4 transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}