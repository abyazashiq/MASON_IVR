"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-beige flex flex-col relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-clay opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy opacity-3 rounded-full -ml-32 -mb-32 pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="bg-clay shadow-neomorph sticky top-0 z-50 border-b-4 border-navy">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-black text-white hover:opacity-90 transition-opacity duration-300"
          >
            MASON-IVR
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                const element = document.getElementById("about");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base font-bold text-white hover:text-beige transition-colors duration-300"
            >
              About
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("mission");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base font-bold text-white hover:text-beige transition-colors duration-300"
            >
              Mission
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="text-base font-bold text-white hover:text-beige transition-colors duration-300"
            >
              Contact Us
            </button>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => router.push("/hire/login")}
              className="px-5 py-2 bg-navy text-white font-bold text-sm rounded-lg hover:bg-opacity-80 transition-all duration-300"
            >
              Hire
            </button>
            <button
              onClick={() => router.push("/apply")}
              className="px-5 py-2 bg-white text-clay font-bold text-sm rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              Apply
            </button>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-start px-6 py-16 relative z-10">
        <div className="max-w-3xl w-full animate-fade-in">
          <p className="text-clay font-black text-lg tracking-widest uppercase mb-2">
            Connecting Skilled Professionals
          </p>
          <h1 className="text-6xl md:text-7xl font-black text-navy mb-4 leading-tight">
            MASON-IVR
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-navy mb-6">
            Intelligent Voice Response for Masonry Services
          </p>
          <div className="w-24 h-2 bg-clay rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-slate leading-relaxed max-w-2xl">
            MASON-IVR is an innovative AI-powered phone system that connects clients with skilled masonry professionals. Using intelligent voice recognition and routing, we make finding and hiring quality mason services as simple as a phone call.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-black text-navy mb-4">What is MASON-IVR?</h2>
          <div className="w-20 h-2 bg-clay rounded-full mb-6"></div>

          <p className="text-xl text-navy leading-relaxed mb-8 max-w-3xl">
            MASON-IVR (Masonry Access Service with Intelligent Voice Response) is a revolutionary phone-based platform that leverages AI and voice technology to connect clients with trusted masonry professionals instantly, 24/7.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Clients */}
            <div className="bg-surface-light shadow-neomorph rounded-lg p-8 border border-navy border-opacity-5 animate-slide-up">
              <h3 className="text-3xl font-black text-navy mb-4">
                For Clients
              </h3>
              <p className="text-lg text-slate leading-relaxed">
                Looking for a skilled mason? MASON-IVR connects you with verified professionals who have been thoroughly screened. Call our IVR system, describe your project, and get instantly matched with qualified professionals ready to help.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="text-base font-bold text-navy">• Verified professionals</li>
                <li className="text-base font-bold text-navy">• Fast and reliable service</li>
                <li className="text-base font-bold text-navy">• Transparent pricing</li>
              </ul>
            </div>

            {/* For Professionals */}
            <div className="bg-surface-light shadow-neomorph rounded-lg p-8 border border-navy border-opacity-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-3xl font-black text-navy mb-4">
                For Professionals
              </h3>
              <p className="text-lg text-slate leading-relaxed">
                Are you a skilled mason looking to grow your business? MASON-IVR gives you access to a steady stream of customer inquiries through our intelligent voice system. Get matched with projects that fit your expertise without extra marketing effort.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="text-base font-bold text-navy">• Steady client flow</li>
                <li className="text-base font-bold text-navy">• Fair compensation</li>
                <li className="text-base font-bold text-navy">• Build your reputation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Goals Section */}
      <section id="mission" className="py-16 px-6 bg-beige relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-black text-navy mb-4">Our Mission & Goals</h2>
          <div className="w-20 h-2 bg-clay rounded-full mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-surface-light shadow-neomorph rounded-lg p-8 border border-navy border-opacity-5 transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-3xl font-black text-clay mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-slate leading-relaxed font-semibold">
                To revolutionize the masonry industry by creating an AI-powered voice system that instantly connects clients with qualified professionals. We eliminate barriers, reduce wait times, and make quality craftsmanship accessible to everyone through intelligent conversation technology.
              </p>
            </div>

            {/* Goal 1 */}
            <div className="bg-surface-light shadow-neomorph rounded-lg p-8 border border-navy border-opacity-5 transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-3xl font-black text-clay mb-4">
                Connection
              </h3>
              <p className="text-lg text-slate leading-relaxed font-semibold">
                Bridge the gap between talented masonry professionals and clients seeking quality work. Make finding and hiring easier than ever before.
              </p>
            </div>

            {/* Goal 2 */}
            <div className="bg-surface-light shadow-neomorph rounded-lg p-8 border border-navy border-opacity-5 transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-3xl font-black text-clay mb-4">
                Opportunity
              </h3>
              <p className="text-lg text-slate leading-relaxed font-semibold">
                Create lasting business opportunities for skilled professionals to grow their careers while delivering exceptional value to clients.
              </p>
            </div>
          </div>

          {/* Why MASON Matters */}
          <div className="mt-8 bg-surface-light shadow-neomorph rounded-lg p-10 border border-navy border-opacity-5">
            <h3 className="text-3xl font-black text-navy mb-6">
              Why MASON Matters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-lg text-slate leading-relaxed font-semibold mb-4">
                  <strong>For the Industry:</strong> The masonry industry often relies on word-of-mouth and phone calls. MASON-IVR modernizes this by creating a centralized platform where trust and verification matter.
                </p>
                <p className="text-lg text-slate leading-relaxed font-semibold">
                  <strong>For Professionals:</strong> We help skilled masons be discovered by more clients and grow their business without the hassle of constant marketing.
                </p>
              </div>
              <div>
                <p className="text-lg text-slate leading-relaxed font-semibold mb-4">
                  <strong>For Clients:</strong> Getting quality work done is stressful. MASON-IVR removes the uncertainty by connecting you with vetted professionals who you can trust.
                </p>
                <p className="text-lg text-slate leading-relaxed font-semibold">
                  <strong>For Everyone:</strong> We're building a fairer, more transparent market where quality work is rewarded and clients get what they pay for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-beige relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-black text-navy mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-slate mb-12 leading-relaxed max-w-2xl">
            Whether you're a client needing professional masonry work or a mason ready to grow your business, MASON-IVR is here to help you succeed through voice-powered connections.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => router.push("/hire/login")}
              className="btn-primary py-5 px-12 text-2xl font-black rounded-lg transform transition-all duration-400 hover:shadow-lg active:scale-95"
            >
              Hire a Professional
            </button>
            <button
              onClick={() => router.push("/apply")}
              className="btn-secondary py-5 px-12 text-2xl font-black rounded-lg transform transition-all duration-400 hover:shadow-lg active:scale-95"
            >
              Apply as a Mason
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-beige border-t-4 border-navy py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-black text-navy mb-4">MASON-IVR</h3>
              <p className="text-navy font-semibold mb-6">Connecting skilled professionals with clients through intelligent voice technology.</p>
              <div>
                <p className="text-sm font-bold text-slate uppercase tracking-wide mb-2">Contact</p>
                <p className="text-navy font-bold mb-1">1-800-MASON-01</p>
                <p className="text-navy font-bold">support@mason-ivr.io</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-navy mb-4">Get Started</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => router.push("/hire/login")} className="text-navy hover:text-clay font-bold">
                    Hire Now
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/apply")} className="text-navy hover:text-clay font-bold">
                    Apply Now
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy border-opacity-20 pt-6">
            <p className="text-navy font-bold">&copy; 2026 MASON-IVR. All rights reserved.</p>
          </div>
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
