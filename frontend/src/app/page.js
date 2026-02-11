"use client";

import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","700"] });

export default function Home() {
  const router = useRouter();

  return (
    <div className={`${inter.className} min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
      {/* Dynamic background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] bg-purple-400 rounded-full opacity-70 animate-blob top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-pink-400 rounded-full opacity-70 animate-blob animation-delay-2000 top-[200px] left-[300px]"></div>
        <div className="absolute w-[700px] h-[700px] bg-cyan-400 rounded-full opacity-50 animate-blob animation-delay-4000 top-[400px] left-[-200px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 animate-gradient-x"></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-12 border border-white/30 text-center">
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-900 drop-shadow-md">
          MASON
        </h1>
        <p className="text-xl text-gray-700 mb-12">
          Your trusted platform for masonry services
        </p>

        {/* Two buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hire Button */}
          <button
            onClick={() => router.push("/hire/login")}
            className="group relative px-8 py-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex flex-col items-center">
              <span className="text-3xl mb-2">💼</span>
              <span>Hire a Mason</span>
              <span className="text-sm font-normal mt-1 opacity-90">Find skilled professionals</span>
            </span>
          </button>

          {/* Apply Button */}
          <button
            onClick={() => router.push("/apply")}
            className="group relative px-8 py-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex flex-col items-center">
              <span className="text-3xl mb-2">🔨</span>
              <span>Apply as Mason</span>
              <span className="text-sm font-normal mt-1 opacity-90">Start your journey with us</span>
            </span>
          </button>
        </div>

        {/* Info section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About MASON</h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto">
            MASON connects skilled masonry professionals with clients looking for quality craftsmanship. 
            Whether you're a contractor seeking experienced masons or a mason looking to expand your opportunities, 
            MASON is your platform for success.
          </p>
        </div>
      </div>

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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
