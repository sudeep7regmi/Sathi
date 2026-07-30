import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#0A1F1A] text-white/80 px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-2">
          <Link href="/" className="text-xs uppercase font-semibold text-[#C8F55A] tracking-wider hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-white/40">
            Last updated: July 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-white/70">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">1. Acceptance of Terms</h2>
            <p>
              By downloading, registering, or using the <strong>SATHI.app</strong> platform, you agree to comply with these Terms of Service. If you do not agree to these terms, please refrain from using the application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">2. Court Bookings & Payments</h2>
            <ul className="list-disc list-inside space-y-2 pl-2 text-white/60">
              <li><strong className="text-white">Reservations:</strong> Bookings made through Sathi are binding upon confirmation and payment receipt.</li>
              <li><strong className="text-white">Pricing:</strong> Court hourly rates, advance deposits, and full payments are determined in coordination with partner futsal turf management. All monetary values are stated in Nepalese Rupees (NPR).</li>
              <li><strong className="text-white">No-Show Policy:</strong> Failure to arrive at the court at the scheduled time without prior cancellation may result in forfeiture of the advance deposit.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">3. Cancellations & Refunds</h2>
            <p>
              Cancellation rules vary depending on individual venue policies:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-white/60">
              <li>Cancellations requested at least 12–24 hours prior to slot time may qualify for partial or full wallet/deposit refund.</li>
              <li>Sathi platform service fees (if applicable) are non-refundable.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">4. Community Conduct & Matchmaking</h2>
            <p>
              When using player matchmaking, creating lobby matches, or joining public fixtures, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-white/60">
              <li>Maintain sportsmanship and treat fellow players and turf managers with respect.</li>
              <li>Avoid abusive, offensive, or discriminatory language in match chats or lobby descriptions.</li>
              <li>Refrain from hosting fraudulent matches or intentionally failing to show up without notifying lobby members.</li>
            </ul>
            <p className="text-xs text-white/40 italic">
              Violation of fair conduct guidelines may result in immediate suspension or permanent banning from Sathi services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">5. Disclaimer of Liability</h2>
            <p>
              Sathi serves as a technology platform connecting players and futsal venues. Sathi is not responsible for physical injuries, lost property, or disputes that occur on the physical futsal grounds. Play responsibly and follow venue safety guidelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">6. Governing Law</h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of Nepal. Any legal disputes arising out of the platform shall be subject to local jurisdiction.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}