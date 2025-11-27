"use client";
import { useRouter } from "next/navigation";

export default function HirePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Hire Skilled Masons</h1>

        <p className="text-gray-700 mb-6 text-lg">
          We connect you with verified, experienced mason workers for all job types.
        </p>

        <button
          onClick={() => router.push("/hire/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
