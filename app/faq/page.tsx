"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Calendar,
  CreditCard,
  Users,
  ShieldCheck,
  MessageSquare,
  Mail,
  PhoneCall,
  Sparkles,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "general" | "booking" | "matchmaking" | "payment";
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  // General
  {
    id: "g1",
    category: "general",
    question: "What is SATHI and how does it work?",
    answer:
      "SATHI is an all-in-one sports ecosystem designed for players and venue owners. Players can discover and book nearby futsal grounds, find match partners or opponent teams, track personal match stats, and participate in local pickup games.",
  },
  {
    id: "g2",
    category: "general",
    question: "Is the SATHI platform free to use for players?",
    answer:
      "Yes! Creating an account, building your player profile, searching for matches, and organizing teams are completely free. You only pay for court reservations when you make a booking.",
  },
  {
    id: "g3",
    category: "general",
    question: "How do player skill levels and positions work?",
    answer:
      "During setup, you choose your primary role (e.g., Pivot, Flank, Fixo, Goalkeeper) and self-assess your skill level. As you play matches and log results, your profile rating updates to help match you with balanced opponents and teammates.",
  },
  {
    id: "g4",
    category: "general",
    question: "How can I request an update to my player stats?",
    answer:
      "To update your player stats, please submit a request to our admin team by sending an email with your profile details and match records to sudeepregmi343@gmail.com or sathiproject@devbhujel.com.np.",
  },

  // Ground Booking
  {
    id: "b1",
    category: "booking",
    question: "How do I book a futsal court?",
    answer:
      "Navigate to the Grounds directory, select your preferred venue, choose an open date and time slot, and submit your reservation request. You will receive an instant status notification once approved by the ground admin.",
  },
  {
    id: "b2",
    category: "booking",
    question: "How long does ground owner review take?",
    answer:
      "Most venue owners confirm bookings within 15–30 minutes. You can check your booking status real-time under 'Upcoming Matches & Active Reservations' in your dashboard.",
  },
  {
    id: "b3",
    category: "booking",
    question: "Can I edit or reschedule my booking time?",
    answer:
      "Rescheduling depends on slot availability and venue policy. If your booking is still pending, you can cancel it from your dashboard and re-book a new slot. For confirmed bookings, please contact the venue directly.",
  },

  // Matchmaking & Teams
  {
    id: "m1",
    category: "matchmaking",
    question: "How can I find missing players or opponent teams?",
    answer:
      "When creating or viewing a match booking, you can toggle 'Open for Matchmaking'. This lists your fixture on the public Player Board, allowing individual players or full teams nearby to challenge or join your slot.",
  },
  {
    id: "m2",
    category: "matchmaking",
    question: "What happens if a player defaults or misses a match?",
    answer:
      "We enforce a fair-play reliability score. Players who fail to show up without prior notice receive penalty strikes on their profile, ensuring high commitment across the community.",
  },

  // Payment & Cancellations
  {
    id: "p1",
    category: "payment",
    question: "What digital payment methods are accepted?",
    answer:
      "We support direct online payments via eSewa, Khalti, and major domestic digital wallets in Nepal, as well as cash payment at the venue (depending on court policy).",
  },
  {
    id: "p2",
    category: "payment",
    question: "What is the cancellation and refund policy?",
    answer:
      "Cancellations made at least 6 hours prior to game time are eligible for a full refund or slot credit. Cancellations within 6 hours may incur a partial venue fee based on the individual ground's cancellation rules.",
  },
];

type CategoryKey = "all" | "general" | "booking" | "matchmaking" | "payment";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [expandedId, setExpandedId] = useState<string | null>("g1");

  // Category Tabs metadata
  const categories = [
    { key: "all", label: "All Questions", icon: HelpCircle },
    { key: "general", label: "General & Account", icon: Sparkles },
    { key: "booking", label: "Ground Booking", icon: Calendar },
    { key: "matchmaking", label: "Matchmaking & Teams", icon: Users },
    { key: "payment", label: "Payments & Refunds", icon: CreditCard },
  ];

  // Filter logic
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="min-h-screen pb-16 pt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          Help & Support Center
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">
          Frequently Asked Questions
        </h1>

        <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
          Everything you need to know about court reservations, player matchmaking,
          team management, and payment policies on SATHI.
        </p>

        {/* Live Search Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. stats, refund, futsal booking, eSewa)..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key as CategoryKey)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div
            className="p-10 rounded-2xl border text-center space-y-3 shadow-2xs"
            style={{
              backgroundColor: "var(--ccolor)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide">
              No matching questions found
            </h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Try adjusting your search terms or select another category above.
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="border rounded-2xl overflow-hidden transition-all duration-200 shadow-2xs hover:border-slate-300"
                style={{
                  backgroundColor: "var(--ccolor)",
                  borderColor: "var(--border-color)",
                }}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer font-bold text-slate-900 text-sm sm:text-base leading-snug"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full shrink-0" />
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-emerald-50 text-emerald-600" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1 font-medium">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Direct Contact / Support Banner */}
      <div
        className="p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 flex items-center justify-center md:justify-start gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> Still have questions?
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Can&apos;t find what you are looking for? Contact our support team directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href="mailto:support@sathi.com.np"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            Email Support
          </a>
          <a
            href="tel:+9779800000000"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            Call Support
          </a>
        </div>
      </div>
    </div>
  );
}