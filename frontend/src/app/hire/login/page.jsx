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
      console.log("Login response:", data);
      const empId = data.employer.emp_id;

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl p-8 rounded-xl w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Employer Login</h1>

        {errorMsg && (
          <p className="text-red-500 text-center text-sm">{errorMsg}</p>
        )}

        <div className="flex flex-col">
          <label className="font-medium mb-1">Email</label>
          <input
            type="email"
            className="border p-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Password</label>
          <input
            type="password"
            className="border p-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Login
        </button>

        {/* SIGNUP BUTTON */}
        <button
          type="button"
          onClick={() => router.push("/hire/signup")}
          className="w-full text-blue-600 mt-3 hover:underline text-center"
        >
          New user? Sign up here
        </button>
      </form>
    </div>
  );
}
