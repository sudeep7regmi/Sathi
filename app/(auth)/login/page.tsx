'use client';

import { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';
import SathiLogo from '@/components/ui/SathiLogo';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 shadow-sm hover:border-slate-300";

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden py-16"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-emerald-400/15 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <Link 
        href="/" 
        className="text-emerald-600 text-3xl font-black tracking-tight mb-8 z-10 hover:opacity-90 transition-opacity flex items-center gap-1"
      >
       <SathiLogo/>
      </Link>

      <div 
        className="relative z-10 border rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-xl backdrop-blur-sm transition-all"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
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

          {/* Password Field with Show/Hide Toggle & Forgot Password Link */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-700 text-xs uppercase font-bold tracking-wider">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium focus:outline-none transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.682-.783c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50/90 border border-red-200 p-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0 fill-current text-red-500" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-md shadow-emerald-600/20 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium">
          <span className="text-slate-500">Don&apos;t have an account? </span>
          <Link href="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline decoration-1 underline-offset-4 transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}