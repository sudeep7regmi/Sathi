import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0A1F1A] text-white/80 px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-2">
          <Link href="/" className="text-xs uppercase font-semibold text-[#C8F55A] tracking-wider hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/40">
            Last updated: July 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-white/70">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">1. Information We Collect</h2>
            <p>
              To provide court booking, player matchmaking, and account services, Sathi collects:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-white/60">
              <li><strong className="text-white">Personal Data:</strong> Name, phone number, email address, and profile picture.</li>
              <li><strong className="text-[#C8F55A]/90">Booking & Payment Data:</strong> Court reservations, payment references, and transaction receipts processed via third-party gateways (e.g., eSewa, Khalti). We do not store sensitive bank account details directly.</li>
              <li><strong className="text-white">Location Data:</strong> Approximate or precise location (with your consent) to display nearby futsal courts and active player lobbies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">2. How We Use Your Information</h2>
            <p>We use your data solely to ensure seamless pitch bookings and player coordination, including:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-white/60">
              <li>Confirming and managing court reservations with partner futsal venue owners.</li>
              <li>Enabling player matchmaking and squad creation.</li>
              <li>Sending automated booking confirmations, SMS alerts, and app updates.</li>
              <li>Preventing fraudulent bookings or fake account creation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">3. Data Sharing & Venue Partners</h2>
            <p>
              We share relevant booking details (such as player name and phone number) with the specific futsal venue host where you reserve a slot to verify your entry upon arrival. We do not sell your personal data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">4. Data Retention & Security</h2>
            <p>
              We implement industry-standard encryption protocols to protect your personal information. Account data is retained as long as your account remains active. You can request account deletion at any time by contacting support.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#C8F55A]">5. Contact Us</h2>
            <p>
              For questions regarding your privacy rights or account deletion requests, reach out to our team at{" "}
              <a href="mailto:sathiproject@devbhujel.com.np" className="text-[#C8F55A] hover:underline">
              sathiproject@devbhujel.com.np              </a>.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}