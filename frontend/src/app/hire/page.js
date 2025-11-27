"use client";
import { useRouter } from "next/navigation";

export default function HirePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x"></div>
      
      {/* Floating decorative blobs */}
      <div className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-[-100px] left-[-80px] animate-blob"></div>
      <div className="absolute w-96 h-96 bg-pink-400 rounded-full opacity-30 bottom-[-120px] right-[-100px] animate-blob animation-delay-2000"></div>

      {/* Main card */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center border border-white/30">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 relative inline-block">
          Hire Skilled Masons
          <span className="block h-1 w-24 bg-blue-500 rounded mt-2 mx-auto"></span>
        </h1>

        <p className="text-gray-700 mb-8 text-lg">
          We connect you with verified, experienced mason workers for all types of construction and repair jobs. 
          Our platform ensures reliability, skill verification, and prompt service.
        </p>

        <button
          onClick={() => router.push("/hire/login")}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition transform text-lg font-semibold"
        >
          Get Started
        </button>
      </div>

      {/* Animation styles */}
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
