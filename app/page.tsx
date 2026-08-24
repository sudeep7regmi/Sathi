import {
  MapPin,
  Zap,
  Users,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/Footer";
import SathiLogo from "@/components/ui/SathiLogo";

export const dynamic = "force-dynamic";

// The app's core features remain static as they are marketing copy
const features = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Courts Near You",
    desc: "Browse verified venues across Pokhara. Filter by price, surface, and open slots.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Book in 60 Seconds",
    desc: "Lock your slot instantly. Instant confirmation straight to the owner's dashboard.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Build Your Squad",
    desc: "Create a team, invite friends, and fill spots by connecting with local players.",
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Local Matches",
    desc: "Discover and join open matches nearby. Track results and build your reputation.",
  },
];

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

interface FeaturedGround {
  id: string;
  name: string;
  address: string;
  pricePerHour: number | string | bigint;
  owner: {
    isVerified: boolean;
  };
}

export default async function Home() {
  let totalVenues = 0;
  let totalPlayers = 0;
  let featuredGrounds: FeaturedGround[] = [];

  // Wrap Prisma calls in try/catch to catch runtime connection errors
  try {
    const [venuesCount, playersCount, grounds] = await Promise.all([
      prisma.ground.count(),
      prisma.user.count({ where: { role: "PLAYER" } }),
      prisma.ground.findMany({
        take: 3, // Fetch the 3 most recently added arenas
        orderBy: { createdAt: "desc" },
        include: { owner: true },
      }),
    ]);

    totalVenues = venuesCount;
    totalPlayers = playersCount;
    featuredGrounds = grounds as unknown as FeaturedGround[];
  } catch (error) {
    console.error("[HOME_PAGE_PRISMA_ERROR]: Failed to load database content.", error);
  }

  // Dynamic stats array using real database numbers or clean fallback defaults
  const dynamicStats = [
    [`${totalVenues > 0 ? totalVenues : "10"}+`, "Verified Venues"],
    [`${totalPlayers > 0 ? totalPlayers : "50"}+`, "Active Players"],
    ["Pokhara", "Base Hub"],
    ["4.9★", "Platform Rating"],
  ];

  return (
    <main className="bg-white text-[#111827] overflow-x-hidden min-h-screen selection:bg-[#C8F55A] selection:text-black">
      {/* GLOBAL NAVIGATION */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#0A1F1A]/90 backdrop-blur-md border-b border-b-white/5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[#C8F55A] items-center flex text-2xl tracking-tight"
            style={DISPLAY}
          >
            <SathiLogo />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-[#C8F55A] text-[#111] px-5 py-2 rounded font-bold text-sm tracking-wider uppercase hover:bg-[#A8D448] transition-all"
            style={DISPLAY}
          >
            Join Now
          </Link>
        </div>
      </nav>

      {/* HERO SECTION — deep forest green */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-b from-[#061612] to-[#0A1F1A] overflow-hidden pt-16">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <circle
            cx="720"
            cy="450"
            r="160"
            fill="none"
            stroke="rgba(200,245,90,0.1)"
            strokeWidth="2"
          />
          <line
            x1="720"
            y1="0"
            x2="720"
            y2="900"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="2"
          />
          <rect
            x="80"
            y="60"
            width="1280"
            height="780"
            rx="4"
            fill="none"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="2"
          />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="text-[#C8F55A] text-xs font-semibold tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-[#C8F55A]" /> Nepal&apos;s Premium
              Futsal Hub
            </p>
            <h1
              className="text-[#F0EDE6] leading-[0.85] mb-8 tracking-tighter"
              style={{ ...DISPLAY, fontSize: "clamp(64px, 9vw, 110px)" }}
            >
              BOOK.
              <br />
              <span className="text-[#b9e16a]">PLAY.</span>
              <br />
              CONQUER.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md">
              The match-making and reservation engine built for players across
              Pokhara. Sign up to map courts, build squads, and play.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="group bg-[#C8F55A] text-[#111] px-8 py-4 rounded font-bold tracking-wide uppercase hover:bg-[#A8D448] shadow-lg shadow-[#C8F55A]/10 transition-all flex items-center gap-2"
                style={DISPLAY}
              >
                Create Free Account{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#venues"
                className="border border-white/10 hover:border-white/30 px-8 py-4 rounded font-bold tracking-wide uppercase transition-all text-white"
                style={DISPLAY}
              >
                Explore Pitches
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            <div className="absolute -inset-4 bg-[#C8F55A]/5 blur-3xl rounded-full pointer-events-none" />
            {dynamicStats.map(([num, label]) => (
              <div
                key={label}
                className="bg-[#12161A]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-md"
              >
                <div
                  className="text-[#C8F55A] text-4xl leading-none mb-1"
                  style={DISPLAY}
                >
                  {num}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-wider">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES — white background */}
      <section id="features" className="py-28 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <p className="text-emerald-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-emerald-500" /> Application Core
            </p>
            <h2
              className="text-[#111827] leading-none text-4xl md:text-6xl tracking-tight"
              style={DISPLAY}
            >
              BUILT TO STREAMLINE YOUR MATCHDAYS
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border-2 border-slate-100 hover:border-[#C8F55A] shadow-xs hover:shadow-xl transition-all duration-300 p-8 rounded-2xl group"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#C8F55A] group-hover:text-black transition-colors">
                  {icon}
                </div>
                <h3
                  className="text-[#111827] text-xl font-bold mb-3 tracking-wide"
                  style={DISPLAY}
                >
                  {title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC VENUE PREVIEW */}
      <section
        id="venues"
        className="bg-black py-28 px-6 md:px-12 border-y border-white/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <p className="text-white text-xl font-black tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-white" /> Verified Operators
            </p>
            <h2
              className="text-white leading-none text-5xl md:text-7xl tracking-tight font-black"
              style={DISPLAY}
            >
              PREVIEW TOP COURTS
            </h2>
            <p className="text-white text-xl md:text-2xl mt-4 font-bold">
              Unlock access to real-time calendars, peak hour parameters, and
              secure bookings upon profile confirmation.
            </p>
          </div>

          {featuredGrounds.length === 0 ? (
            <div className="bg-black border-2 border-white rounded-2xl p-10 text-center">
              <p className="text-white text-2xl font-bold">
                New arenas are joining the platform right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGrounds.map((ground: FeaturedGround) => (
                <div
                  key={ground.id}
                  className="bg-black border-2 border-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/20 group"
                >
                  <div className="h-52 bg-white relative flex items-center justify-center overflow-hidden border-b-2 border-white">
                    <svg
                      className="absolute inset-0 w-full h-full opacity-20"
                      viewBox="0 0 320 144"
                      aria-hidden
                    >
                      <rect
                        x="10"
                        y="10"
                        width="300"
                        height="124"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                      />
                      <line
                        x1="160"
                        y1="10"
                        x2="160"
                        y2="134"
                        stroke="black"
                        strokeWidth="2"
                      />
                      <circle
                        cx="160"
                        cy="72"
                        r="28"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="text-6xl group-hover:scale-125 transition-transform duration-300">
                      ⚽
                    </span>
                    {ground.owner?.isVerified && (
                      <span className="absolute top-4 right-4 text-sm font-black px-3 py-1.5 rounded-full bg-black text-white uppercase tracking-widest flex items-center gap-1.5 border border-white">
                        <ShieldCheck className="w-4 h-4 text-white" />{" "}
                        Verified Partner
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        className="text-white text-2xl md:text-3xl font-black tracking-wide line-clamp-1"
                        style={DISPLAY}
                      >
                        {ground.name}
                      </h3>
                      <div className="flex items-center gap-1 text-white font-black text-xl shrink-0">
                        <Star className="w-5 h-5 fill-white text-white" /> 5.0
                      </div>
                    </div>

                    <p className="text-white text-xl font-bold flex items-center gap-2 line-clamp-1">
                      <MapPin className="w-6 h-6 text-white shrink-0" />{" "}
                      {ground.address}
                    </p>

                    <div className="flex items-center justify-between border-t-2 border-white/20 pt-5">
                      <div className="flex flex-col">
                        <span className="text-white text-xl font-black uppercase tracking-wider">
                          Starting From
                        </span>
                        <span
                          className="text-white text-3xl font-black"
                          style={DISPLAY}
                        >
                          Rs. {ground.pricePerHour.toString()}
                          <span className="text-xl text-white font-bold">
                            {" "}
                            /hr
                          </span>
                        </span>
                      </div>
                      <Link
                        href="/register"
                        className="bg-white hover:bg-black text-black hover:text-white border-2 border-white text-xl px-5 py-3 rounded-xl font-black uppercase tracking-wider transition-all"
                        style={DISPLAY}
                      >
                        Check Slots
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FINAL CALL TO ACTION — high-contrast emerald theme */}
      <section className="py-32 px-6 text-center relative overflow-hidden bg-gradient-to-b from-[#0A1F1A] to-[#061612]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-[#C8F55A]/10 blur-[120px]" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2
            className="text-[#F0EDE6] leading-[0.9] mb-6 tracking-tighter"
            style={{ ...DISPLAY, fontSize: "clamp(48px, 7vw, 84px)" }}
          >
            READY TO CLIMB
            <br />
            <span className="text-[#C8F55A]">THE LEAGUE?</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg mb-10 max-w-md mx-auto font-medium">
            Create a verified account today to track individual performance
            parameters, reserve slots, and schedule matches flawlessly.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#C8F55A] text-[#111] px-10 py-4 rounded-xl text-lg font-bold tracking-wide uppercase hover:bg-[#A8D448] transition-all shadow-xl shadow-[#C8F55A]/20"
            style={DISPLAY}
          >
            Register Profile Instantly
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}