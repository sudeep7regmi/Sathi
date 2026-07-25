'use client';

import { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/login', formData);
      if (response.data.success) {
        const role = response.data.role;
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

  const inputClass =
    "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm";

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden py-16"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Background glow node decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-100/60 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <Link href="/" className="text-emerald-600 text-2xl font-black tracking-tight mb-6 z-10">
        SATHI<span className="text-slate-400">.app</span>
      </Link>

      <div 
        className="relative z-10 border rounded-2xl p-8 w-full max-w-md shadow-sm"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 text-xs uppercase font-bold tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="sudeep@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs uppercase font-bold tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          
          {error && (
            <p className="text-sm font-bold text-red-600 text-center bg-red-50 border border-red-200 py-2.5 rounded-xl uppercase tracking-wider">
              {error}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer shadow-sm mt-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium">
          <span className="text-slate-500">Don&apos;t have an account? </span>
          <Link href="/register" className="text-emerald-600 font-bold hover:underline decoration-1 underline-offset-4 transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}