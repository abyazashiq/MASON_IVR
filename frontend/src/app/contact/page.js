"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // This is a placeholder - you'll need to set up a backend endpoint
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-clay opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy opacity-3 rounded-full -ml-32 -mb-32 pointer-events-none"></div>

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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Form */}
            <div className="animate-fade-in">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-5xl md:text-6xl font-black text-navy mb-4">
                  Get in Touch
                </h1>
                <div className="w-20 h-2 bg-clay rounded-full mb-6"></div>
                <p className="text-xl text-slate leading-relaxed">
                  Have questions about MASON-IVR? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              {/* Contact Form Card */}
              <div className="bg-surface-light shadow-neomorph rounded-lg p-10 border border-navy border-opacity-5 animate-scale-in">
            {submitted && (
              <div className="mb-6 p-6 bg-success bg-opacity-10 border-l-4 border-success rounded-lg animate-fade-in">
                <p className="text-xl font-black text-success mb-2">✓ Message Sent!</p>
                <p className="text-navy font-semibold">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-6 bg-error bg-opacity-10 border-l-4 border-error rounded-lg animate-fade-in">
                <p className="text-lg font-bold text-error">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="flex flex-col">
                <label htmlFor="name" className="font-bold text-navy mb-2 text-base">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white text-navy border-2 border-slate border-opacity-30 p-4 rounded-lg focus:border-clay focus:shadow-lg focus:outline-none transition-all duration-300 text-lg"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label htmlFor="email" className="font-bold text-navy mb-2 text-base">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white text-navy border-2 border-slate border-opacity-30 p-4 rounded-lg focus:border-clay focus:shadow-lg focus:outline-none transition-all duration-300 text-lg"
                />
              </div>

              {/* Subject Field */}
              <div className="flex flex-col">
                <label htmlFor="subject" className="font-bold text-navy mb-2 text-base">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-white text-navy border-2 border-slate border-opacity-30 p-4 rounded-lg focus:border-clay focus:shadow-lg focus:outline-none transition-all duration-300 text-lg"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col">
                <label htmlFor="message" className="font-bold text-navy mb-2 text-base">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="bg-white text-navy border-2 border-slate border-opacity-30 p-4 rounded-lg focus:border-clay focus:shadow-lg focus:outline-none transition-all duration-300 text-lg resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-bold rounded-lg transform transition-all duration-400 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t-2 border-navy border-opacity-10 hidden">
              <h3 className="text-2xl font-black text-navy mb-6">Other Ways to Reach Us</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📧</span>
                  <div>
                    <p className="text-sm font-bold text-slate uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="text-lg font-bold text-navy">support@mason.app</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📱</span>
                  <div>
                    <p className="text-sm font-bold text-slate uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <p className="text-lg font-bold text-navy">1-800-MASON-01</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🕒</span>
                  <div>
                    <p className="text-sm font-bold text-slate uppercase tracking-wide mb-1">
                      Hours
                    </p>
                    <p className="text-lg font-bold text-navy">Mon-Fri: 9AM - 6PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📍</span>
                  <div>
                    <p className="text-sm font-bold text-slate uppercase tracking-wide mb-1">
                      Location
                    </p>
                    <p className="text-lg font-bold text-navy">Online Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

            {/* Right Column - Contact Info */}
            <div className="animate-fade-in lg:pt-12">
              <div className="bg-surface-light shadow-neomorph rounded-lg p-10 border border-navy border-opacity-5 h-full">
                <h2 className="text-3xl font-black text-navy mb-8">Other Ways to Reach Us</h2>
                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-bold text-slate uppercase tracking-widest mb-2">
                      Email
                    </p>
                    <p className="text-2xl font-black text-navy mb-1">support@mason-ivr.io</p>
                    <p className="text-slate text-base">We typically respond within 24 hours</p>
                  </div>
                  <div className="border-t border-navy border-opacity-10 pt-8">
                    <p className="text-sm font-bold text-slate uppercase tracking-widest mb-2">
                      Phone
                    </p>
                    <p className="text-2xl font-black text-navy mb-1">1-800-MASON-01</p>
                    <p className="text-slate text-base">Available 24/7 for emergencies</p>
                  </div>
                  <div className="border-t border-navy border-opacity-10 pt-8">
                    <p className="text-sm font-bold text-slate uppercase tracking-widest mb-2">
                      Business Hours
                    </p>
                    <div className="space-y-2 text-navy font-semibold">
                      <p>Monday - Friday: 9AM - 6PM EST</p>
                      <p>Saturday: 10AM - 4PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                  <div className="border-t border-navy border-opacity-10 pt-8">
                    <p className="text-sm font-bold text-slate uppercase tracking-widest mb-2">
                      Follow Us
                    </p>
                    <div className="flex gap-4">
                      <button className="text-2xl hover:text-clay transition-colors duration-300">𝕏</button>
                      <button className="text-2xl hover:text-clay transition-colors duration-300">f</button>
                      <button className="text-2xl hover:text-clay transition-colors duration-300">in</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Footer */}
      <footer className="bg-navy bg-opacity-5 border-t-2 border-navy border-opacity-10 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-navy font-bold">&copy; 2026 MASON. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-scale-in {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
