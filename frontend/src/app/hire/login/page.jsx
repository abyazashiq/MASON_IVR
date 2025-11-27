"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HireLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:8000/employer/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const empId = data.employer?.emp_id;

      if (data?.verified) {
        router.push(`/hire/dashboard?emp_id=${empId}`);
      } else {
        setErrorMsg("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden p-6">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x"></div>

      {/* Floating blobs */}
      <div className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-[-100px] left-[-80px] animate-blob"></div>
      <div className="absolute w-96 h-96 bg-pink-400 rounded-full opacity-30 bottom-[-120px] right-[-100px] animate-blob animation-delay-2000"></div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-md shadow-2xl p-8 rounded-3xl w-full max-w-sm space-y-6 border border-white/30"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">
          Employer Login
          <span className="block h-1 w-16 bg-blue-600 rounded mt-2 mx-auto"></span>
        </h1>

        {errorMsg && (
          <p className="text-red-500 text-center text-sm">{errorMsg}</p>
        )}

        <div className="flex flex-col">
          <label className="font-medium mb-1">Email</label>
         <label className="font-medium mb-1 text-gray-900">Email</label>
<input
  type="email"
  className="bg-white text-gray-900 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-900 mb-1">Password</label>
          
<input
  type="password"
  className="bg-white text-gray-900 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition transform font-semibold"
        >
          Login
        </button>

        {/* Signup button */}
        <button
          type="button"
          onClick={() => router.push("/hire/signup")}
          className="w-full text-blue-600 mt-3 hover:underline text-center font-medium"
        >
          New user? Sign up here
        </button>
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
