"use client";
import Link from "next/link";
import Image from "next/image";
import SathiLogo from "./ui/SathiLogo";

export default function Footer() {
  const DISPLAY = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 900,
  };

  return (
    <footer className="border-t border-white/5 bg-[#0A1F1A] text-white/70">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              {/* <Image
                src="/favicon.ico" // Replace with your logo path
                alt="Sathi Logo"
                width={36}
                height={36}
                className="object-contain"
              /> */}
              <SathiLogo/>
              {/* <span
                className="text-[#C8F55A] text-2xl tracking-tight font-bold"
                style={DISPLAY}
              >
                SATHI<span className="text-white/30">.app</span>
              </span> */}
            </div>
            

            <p className="text-sm text-white/60 max-w-sm leading-relaxed">
              Book courts, find players, and organize matches effortlessly. The
              ultimate platform built for futsal players and turf owners.
            </p>

            {/* Newsletter Input */}
            {/* <div className="space-y-2">
              <label className="text-xs uppercase font-semibold text-white/50 tracking-wider">
                Stay updated
              </label>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2 max-w-sm"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/10 rounded px-3.5 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8F55A] transition-colors flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#C8F55A] text-[#111] px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#A8D448] transition-colors"
                  style={DISPLAY}
                >
                  Join
                </button>
              </form>
            </div> */}
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-semibold text-white/40 tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/book"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Find Courts
                </Link>
              </li>
              <li>
                <Link
                  href="/matchmaking"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Find Players
                </Link>
              </li>
              <li>
                <Link
                  href="/tournaments"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Turf Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-semibold text-white/40 tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-semibold text-white/40 tracking-wider">
              Legal & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refunds"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Cancellation & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#C8F55A] transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-white/5 bg-[#071613] py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright & Live Status */}
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>© 2026 Sathi App Inc. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-5 text-sm text-white/50">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#C8F55A] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#C8F55A] transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#C8F55A] transition-colors"
            >
              X (Twitter)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
