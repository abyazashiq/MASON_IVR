"use client";
import { useRouter } from "next/navigation";

export default function HirePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col bg-beige overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-clay shadow-neomorph sticky top-0 z-50 border-b-4 border-navy">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-black text-white hover:opacity-90 transition-opacity duration-300"
          >
            MASON-IVR
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 bg-navy text-white font-bold text-sm rounded-lg hover:bg-opacity-80 transition-all duration-300"
          >
            ← Back Home
          </button>
        </div>
      </nav>

      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-clay opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy opacity-3 rounded-full -ml-32 -mb-32 pointer-events-none"></div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        {/* Main card */}
        <div className="bg-surface-light shadow-neomorph rounded-lg p-12 max-w-xl w-full text-center border border-navy border-opacity-5 animate-slide-up">
        {/* Bold heading */}
        <h1 className="text-5xl font-black text-navy mb-2">
          Hire Skilled Masons
        </h1>

        {/* Bold underline */}
        <div className="w-20 h-1 bg-clay rounded-full mx-auto mb-8"></div>

        <p className="text-lg text-navy leading-relaxed mb-4">
          We connect you with verified, experienced mason professionals for all
          types of construction and repair jobs.
        </p>

        <p className="text-lg text-slate leading-relaxed mb-8">
          Our platform ensures reliability, skill verification, and prompt
          service. Get started finding the right professional for your project.
        </p>

        {/* Primary CTA Button */}
        <button
          onClick={() => router.push("/hire/login")}
          className="btn-primary py-5 px-12 text-xl font-bold w-full mb-4 transform transition-all duration-400 rounded-lg hover:scale-105 active:scale-95"
        >
          Get Started
        </button>

        {/* Secondary info section */}
        <div className="mt-10 pt-8 border-t-2 border-navy border-opacity-10">
          <h2 className="text-2xl font-black text-navy mb-4">Why Choose MASON-IVR?</h2>

          <div className="space-y-4">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="text-3xl font-black text-clay min-w-12">✓</span>
              <div className="text-left">
                <h3 className="font-bold text-navy text-lg">Verified Professionals</h3>
                <p className="text-slate text-base">All masons are screened and verified</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="text-3xl font-black text-clay min-w-12">✓</span>
              <div className="text-left">
                <h3 className="font-bold text-navy text-lg">Instant Availability</h3>
                <p className="text-slate text-base">Access available masons 24/7</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <span className="text-3xl font-black text-clay min-w-12">✓</span>
              <div className="text-left">
                <h3 className="font-bold text-navy text-lg">Transparent Pricing</h3>
                <p className="text-slate text-base">No hidden fees, fair rates</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy bg-opacity-5 border-t-2 border-navy border-opacity-10 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-navy font-bold">&copy; 2026 MASON-IVR. All rights reserved.</p>
        </div>
      </footer>
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-slide-up {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
