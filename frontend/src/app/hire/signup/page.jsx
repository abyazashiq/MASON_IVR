"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HireSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [location, setLocation] = useState("");
  const [expectedWage, setExpectedWage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm || !location || !expectedWage) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"}/employer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          location,
          expected_wage: parseFloat(expectedWage),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/hire/login");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden p-6">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x"></div>

      {/* Floating blobs */}
      <div className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-[-100px] left-[-80px] animate-blob"></div>
      <div className="absolute w-96 h-96 bg-pink-400 rounded-full opacity-30 bottom-[-120px] right-[-100px] animate-blob animation-delay-2000"></div>

      {/* Signup Card */}
      <form
        onSubmit={handleSignup}
        className="bg-white/90 backdrop-blur-md shadow-2xl p-8 rounded-3xl w-full max-w-md space-y-5 border border-white/30"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">
          Hire – Sign Up
          <span className="block h-1 w-16 bg-blue-600 rounded mt-2 mx-auto"></span>
        </h1>

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900">Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            className="bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            className="bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900">Location</label>
          <input
            type="text"
            placeholder="Enter your location"
            className="bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900">Expected Wage</label>
          <input
            type="number"
            placeholder="Expected wage"
            className="bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={expectedWage}
            onChange={(e) => setExpectedWage(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition transform font-semibold"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-700 mt-2">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push("/hire/login")}
          >
            Log in here
          </span>
        </p>
      </form>

      {/* Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 400% 400%;
        }

        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
