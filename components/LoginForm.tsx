"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Fixed leading slash for absolute route consistency
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Login successful");
        router.push("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen flex flex-col items-center justify-center p-6 selection:bg-[#C8F55A] selection:text-black relative overflow-hidden">
      {/* Background glow node matching landing page context */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[100px] pointer-events-none" />

      {/* Decorative Brand Header back to home */}
      <Link
        href="/"
        className="text-[#C8F55A] text-2xl tracking-tight mb-8 z-10"
        style={DISPLAY}
      >
        SATHI<span className="text-white/40">.app</span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-[#12161A] border border-white/5 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1
            className="text-4xl text-[#F0EDE6] uppercase tracking-wide mb-2"
            style={DISPLAY}
          >
            Welcome Back
          </h1>
          <p className="text-white/50 text-sm">
            Sign in using your registered email and password
          </p>
        </div>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
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
              value={password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="w-full bg-[#C8F55A] text-[#111] py-3.5 rounded-xl text-base font-bold tracking-wider uppercase hover:bg-[#A8D448] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#C8F55A]/5"
            style={DISPLAY}
          >
            Sign In
          </button>

          <div className="text-center mt-2">
            <span className="text-white/40 text-sm">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/register"
              className="text-[#C8F55A] text-sm font-semibold hover:underline decoration-1 underline-offset-4"
            >
              Register Here
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
