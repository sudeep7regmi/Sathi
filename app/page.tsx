
import { MapPin, Zap, Users, Trophy, ArrowRight, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

// Mock static data to populate the view instantly on the server
const features = [
  { icon: <MapPin className="w-5 h-5" />, title: "Courts Near You", desc: "Browse verified venues across Kathmandu Valley. Filter by price, surface, and open slots." },
  { icon: <Zap className="w-5 h-5" />, title: "Book in 60 Seconds", desc: "Lock your slot and pay via eSewa or Khalti. Instant confirmation, no phone calls." },
  { icon: <Users className="w-5 h-5" />, title: "Build Your Squad", desc: "Create a team, invite friends, and fill spots by connecting with local players." },
  { icon: <Trophy className="w-5 h-5" />, title: "Local Tournaments", desc: "Discover and register for futsal tourneys nearby. Track results live." },
];

const highlights = [
  { name: "Lalitpur Sports Arena", loc: "Pulchowk, Lalitpur", rating: "4.9", price: "₨ 1,200" },
  { name: "Galaxy Futsal Club", loc: "Koteshwor, Kathmandu", rating: "4.7", price: "₨ 1,000" },
  { name: "Baneshwor Arena", loc: "Baneshwor, Kathmandu", rating: "4.8", price: "₨ 1,100" },
];

const DISPLAY = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 };

export default function Home() {
  return (
    <main className="bg-[#0B0C10] text-[#F0EDE6] overflow-x-hidden min-h-screen selection:bg-[#C8F55A] selection:text-black">
      
      {/* GLOBAL NAVIGATION */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#0A1F1A]/80 backdrop-blur-md border-b border-b-white/5">
        <Link href="/" className="text-[#C8F55A] text-2xl tracking-tight" style={DISPLAY}>
          SATHI<span className="text-white/40">.app</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="bg-[#C8F55A] text-[#111] px-5 py-2 rounded font-bold text-sm tracking-wider uppercase hover:bg-[#A8D448] transition-all" style={DISPLAY}>
            Join Now
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-b from-[#0A1F1A] to-[#0B0C10] overflow-hidden pt-16">
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="720" cy="450" r="160" fill="none" stroke="rgba(200,245,90,0.1)" strokeWidth="2" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="rgba(255,255,255,0.02)" strokeWidth="2" />
          <rect x="80" y="60" width="1280" height="780" rx="4" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="2" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="text-[#C8F55A] text-xs font-semibold tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-[#C8F55A]" /> Nepal&apos;s Premium Futsal Hub
            </p>
            <h1 className="text-[#F0EDE6] leading-[0.85] mb-8 tracking-tighter" style={{ ...DISPLAY, fontSize: "clamp(64px, 9vw, 110px)" }}>
              BOOK.<br />
              <span className="text-[#C8F55A]">PLAY.</span><br />
              CONQUER.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md">
              The match-making and reservation engine built for players across Kathmandu Valley. Sign up to map courts, build squads, and play.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="group bg-[#C8F55A] text-[#111] px-8 py-4 rounded font-bold tracking-wide uppercase hover:bg-[#A8D448] shadow-lg shadow-[#C8F55A]/10 transition-all flex items-center gap-2" style={DISPLAY}>
                Create Free Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#venues" className="border border-white/10 hover:border-white/30 px-8 py-4 rounded font-bold tracking-wide uppercase transition-all" style={DISPLAY}>
                Explore Pitches
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            <div className="absolute -inset-4 bg-[#C8F55A]/5 blur-3xl rounded-full pointer-events-none" />
            {[["150+", "Verified Venues"], ["30K+", "Active Players"], ["Kathmandu", "Base Hub"], ["4.9★", "User Satisfaction"]].map(([num, label]) => (
              <div key={label} className="bg-[#12161A]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                <div className="text-[#C8F55A] text-4xl leading-none mb-1" style={DISPLAY}>{num}</div>
                <div className="text-white/40 text-xs uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="text-[#C8F55A] text-xs font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-[#C8F55A]" /> Application Core
          </p>
          <h2 className="text-[#F0EDE6] leading-none text-4xl md:text-6xl tracking-tight" style={DISPLAY}>
            BUILT TO STREAMLINE YOUR MATCHDAYS
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-[#12161A] border border-white/5 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-[#C8F55A]/10 text-[#C8F55A] rounded-xl flex items-center justify-center mb-6">{icon}</div>
              <h3 className="text-[#F0EDE6] text-xl font-bold mb-3 tracking-wide" style={DISPLAY}>{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VENUE VISUAL PREVIEW */}
      <section id="venues" className="bg-[#0A1F1A] py-28 px-6 md:px-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <p className="text-[#C8F55A] text-xs font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#C8F55A]" /> Verified Operators
            </p>
            <h2 className="text-[#F0EDE6] leading-none text-4xl md:text-6xl tracking-tight" style={DISPLAY}>
              PREVIEW TOP VALLEY COURTS
            </h2>
            <p className="text-white/50 text-sm mt-4">
              Unlock access to real-time calendars, peak hour parameters, and electronic payment gateways upon profile confirmation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((venue, idx) => (
              <div key={idx} className="bg-[#12161A] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 group">
                <div className="h-44 bg-[#0F2C24] relative flex items-center justify-center overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 320 144" aria-hidden>
                    <rect x="10" y="10" width="300" height="124" fill="none" stroke="white" strokeWidth="1.5" />
                    <line x1="160" y1="10" x2="160" y2="134" stroke="white" strokeWidth="1.5" />
                    <circle cx="160" cy="72" r="28" fill="none" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">⚽</span>
                  <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-white/70 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#C8F55A]" /> Verified Partner
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[#F0EDE6] text-xl font-bold tracking-wide" style={DISPLAY}>{venue.name}</h3>
                    <div className="flex items-center gap-1 text-[#C8F55A] font-bold text-sm">
                      <Star className="w-3.5 h-3.5 fill-current" /> {venue.rating}
                    </div>
                  </div>
                  <p className="text-white/50 text-sm mb-5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C8F55A]" /> {venue.loc}
                  </p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider">Starting From</span>
                      <span className="text-[#C8F55A] text-xl font-black" style={DISPLAY}>{venue.price}<span className="text-xs text-white/40 font-normal"> /hr</span></span>
                    </div>
                    <Link href="/register" className="bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2 rounded font-semibold transition-all">
                      Check Slots
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL GATE CALL TO ACTION */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-[#C8F55A]/5 blur-[120px]" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-[#F0EDE6] leading-[0.9] mb-6 tracking-tighter" style={{ ...DISPLAY, fontSize: "clamp(48px, 7vw, 84px)" }}>
            READY TO CLIMB<br />THE LEAGUE?
          </h2>
          <p className="text-white/50 text-base md:text-lg mb-10 max-w-md mx-auto">
            Create an verified account today to track individual performance parameters, reserve slots, and schedule matches flawlessly.
          </p>
          <Link href="/register" className="inline-block bg-[#C8F55A] text-[#111] px-10 py-4 rounded-xl text-lg font-bold tracking-wide uppercase hover:bg-[#A8D448] transition-all" style={DISPLAY}>
            Register Profile Instantly
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6 md:px-12 bg-[#08090C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[#C8F55A] text-xl" style={DISPLAY}>SATHI<span className="text-white/30">.app</span></span>
          <p className="text-white/40 text-xs tracking-wide">© 2026 Sathi App Inc. All systems operational.</p>
        </div>
      </footer>

    </main>
  );
}