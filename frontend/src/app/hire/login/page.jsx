"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HireLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"}/employer/login`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      const empId = data.employer?.emp_id;

      if (data?.verified) {
        router.push(`/hire/dashboard?emp_id=${empId}`);
      } else {
        setErrorMsg("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => router.push("/contact")}
            className="px-5 py-2 bg-navy text-white font-bold text-sm rounded-lg hover:bg-opacity-80 transition-all duration-300"
          >
            Contact Us
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-6">
        {/* Subtle geometric shapes */}
        <div className="absolute top-12 right-12 w-52 h-52 bg-clay opacity-5 rounded-lg pointer-events-none"></div>
        <div className="absolute bottom-16 left-8 w-60 h-60 bg-navy opacity-3 rounded-full pointer-events-none"></div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-surface-light shadow-neomorph p-10 rounded-lg w-full max-w-sm space-y-6 border border-navy border-opacity-5 animate-scale-in relative z-10"
        >
        {/* Bold Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-navy mb-2">Employer Login</h1>
          <div className="w-16 h-1 bg-clay rounded-full mx-auto"></div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-error bg-opacity-10 border-l-4 border-error p-4 rounded animate-fade-in">
            <p className="text-error font-bold text-base">{errorMsg}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col">
          <label htmlFor="email" className="font-bold text-navy mb-2 text-base">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="bg-white text-navy border-2 border-slate border-opacity-30 p-4 rounded-lg focus:border-clay focus:shadow-lg focus:outline-none transition-all duration-300 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label htmlFor="password" className="font-bold text-navy mb-2 text-base">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="bg-white text-navy border-2 border-slate border-opacity-30 p-4 rounded-lg focus:border-clay focus:shadow-lg focus:outline-none transition-all duration-300 text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="btn-primary w-full py-4 text-lg font-bold rounded-lg transform transition-all duration-400 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && <span className="animate-spin">⏳</span>}
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate bg-opacity-20"></div>
          <span className="text-slate font-bold text-sm">or</span>
          <div className="flex-1 h-px bg-slate bg-opacity-20"></div>
        </div>

        {/* Signup Link */}
        <button
          type="button"
          onClick={() => router.push("/hire/signup")}
          className="btn-secondary w-full py-4 text-base font-bold rounded-lg"
        >
          New user? Sign up here
        </button>

        {/* Back link */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => router.push("/hire")}
            className="text-slate hover:text-clay font-bold text-base transition-colors duration-300 underline underline-offset-4"
          >
            ← Back to Hire page
          </button>
        </div>
      </form>
    </div>

    {/* Footer */}
    <footer className="bg-navy bg-opacity-2 border-t-2 border-navy border-opacity-5 py-8 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <p className="text-navy font-bold">&copy; 2026 MASON-IVR. All rights reserved.</p>
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
