"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
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

  const inputClass =
    "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm";

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Background glow node decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-100/60 blur-[100px] pointer-events-none" />

      {/* Decorative Brand Header back to home */}
      <Link
        href="/"
        className="text-emerald-600 text-2xl font-black tracking-tight mb-8 z-10"
      >
        SATHI<span className="text-slate-400">.app</span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 border rounded-2xl p-8 w-full max-w-md shadow-sm"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Sign in using your registered email and password
          </p>
        </div>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-slate-700 text-xs uppercase font-bold tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
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
              value={password}
              onChange={handleChange}
              placeholder="********"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            sign in
          </button>

          <div className="text-center mt-2">
            <span className="text-slate-500 text-sm font-medium">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/register"
              className="text-emerald-600 text-sm font-bold hover:underline decoration-1 underline-offset-4"
            >
              Register Here
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}