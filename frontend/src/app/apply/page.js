"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","700"] });

export default function Apply() {
  const [sessionId, setSessionId] = useState("");
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [fields, setFields] = useState({});
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
  const MAX_RETRIES = 3;

  const handleStart = async () => {
    try {
      setError("");
      setLoading(true);
      
      // Create session ID
      const sid = crypto.randomUUID();
      console.log("[DEBUG] Created session ID:", sid);
      setSessionId(sid);

      // Test backend connection first
      try {
        const testRes = await fetch(`${BACKEND_URL}/health`, { method: "GET" });
        console.log("[DEBUG] Health check:", testRes.status);
        if (!testRes.ok) {
          throw new Error("Backend health check failed");
        }
      } catch (err) {
        console.warn("[WARN] Health check failed:", err.message);
        // Continue anyway - endpoint might not exist
      }

      // Reset session on backend
      const formData = new FormData();
      formData.append("session_id", sid);
      
      console.log("[DEBUG] Sending reset request with session_id:", sid);
      const response = await fetch(`${BACKEND_URL}/reset`, { 
        method: "POST", 
        body: formData
      });

      console.log("[DEBUG] Reset response:", response.status);
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} - ${response.statusText}`);
      }

      setStarted(true);
      setAssistantText("Initializing... Please wait.");
      setLoading(false);

      setTimeout(() => {
        console.log("[DEBUG] Starting recording with session_id:", sid);
        setAssistantText("Starting application. Please speak after the tone.");
        startRecording();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(`Failed to start: ${err.message}. Please check your connection and try again.`);
      console.error("[ERROR] Start failed:", err);
    }
  };

  const startRecording = async () => {
    try {
      if (finished) return;
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setRecording(true);
      setError("");
      mediaRecorderRef.current = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        setError(`Recording error: ${event.error}`);
        setRecording(false);
      };

      mediaRecorderRef.current.onstop = () => {
        if (!finished && audioChunksRef.current.length > 0) {
          sendAudioToBackend();
        } else if (audioChunksRef.current.length === 0) {
          setError("No audio recorded. Please try again.");
          setRecording(false);
        }
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      setRecording(false);
      if (err.name === "NotAllowedError") {
        setError("Microphone permission denied. Please enable microphone access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setError("No microphone found. Please connect a microphone and try again.");
      } else {
        setError(`Microphone error: ${err.message}`);
      }
      console.error(err);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudioToBackend = async () => {
    if (finished) return;

    // Validate sessionId exists
    if (!sessionId || sessionId.trim() === "") {
      setError("Session not initialized. Please restart the application.");
      setRecording(false);
      return;
    }

    try {
      setLoading(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      if (audioBlob.size === 0) {
        throw new Error("Audio blob is empty");
      }

      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("file", audioBlob, "audio.webm");

      console.log("[DEBUG] Sending to backend:", {
        url: `${BACKEND_URL}/ivr`,
        sessionId: sessionId,
        audioSize: audioBlob.size,
        audioType: audioBlob.type
      });

      const res = await fetch(`${BACKEND_URL}/ivr`, {
        method: "POST",
        body: formData
      });

      console.log("[DEBUG] Response status:", res.status);
      const responseText = await res.text();
      console.log("[DEBUG] Response body:", responseText);

      if (!res.ok) {
        let errorMsg = `Backend error: ${res.status}`;
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.detail) {
            errorMsg = errorData.detail;
            if (Array.isArray(errorData.detail)) {
              errorMsg = errorData.detail.map(d => `${d.loc.join(".")}: ${d.msg}`).join(", ");
            }
          }
        } catch (e) {
          errorMsg = responseText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const json = JSON.parse(responseText);

      if (!json || !json.assistant_text) {
        throw new Error("Invalid response from backend");
      }

      setAssistantText(json.assistant_text);
      setFields(json.fields || {});
      setFinished(json.finished || false);
      setRetryCount(0);
      setLoading(false);

      if (json.audio_url) {
        try {
          const audio = new Audio(`${BACKEND_URL}${json.audio_url}`);
          audio.onerror = () => console.warn("Failed to load audio");
          audio.play().catch(err => console.warn("Audio playback failed:", err));
        } catch (err) {
          console.warn("Audio playback error:", err);
        }
      }

      if (!json.finished) {
        setTimeout(() => startRecording(), 1500);
      }
    } catch (err) {
      setLoading(false);
      setRecording(false);
      setError(`Error: ${err.message}`);
      console.error("[ERROR]", err);
      
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          if (confirm("Error processing audio. Retry?")) {
            setRetryCount(retryCount + 1);
            startRecording();
          }
        }, 1000);
      }
    }
  };

  return (
    <div className={`${inter.className} min-h-screen flex flex-col items-center p-6 relative overflow-hidden`}>
      {/* Dynamic background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] bg-purple-400 rounded-full opacity-70 animate-blob top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-pink-400 rounded-full opacity-70 animate-blob animation-delay-2000 top-[200px] left-[300px]"></div>
        <div className="absolute w-[700px] h-[700px] bg-cyan-400 rounded-full opacity-50 animate-blob animation-delay-4000 top-[400px] left-[-200px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 animate-gradient-x"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg shadow-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
        disabled={loading}
      >
        ← Back Home
      </button>

      {/* Main Card */}
      <div className="w-full max-w-2xl mt-10 bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/30">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900 drop-shadow-md">
          Apply as a Mason
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-in">
            <p className="font-medium">⚠️ {error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            <p className="font-medium">⏳ {assistantText || "Processing..."}</p>
          </div>
        )}

        {!started && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-gray-700 mb-4">
              Welcome! Click below to start your application. You'll participate in a voice-based interview guided by our AI system.
            </p>
            <p className="text-sm text-gray-600 text-center">
              ✓ Make sure your microphone is enabled<br/>
              ✓ Find a quiet space<br/>
              ✓ Speak clearly when prompted
            </p>
            <button
              className="px-6 py-3 text-lg bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? "Initializing..." : "Start Application"}
            </button>
          </div>
        )}

        {started && (
          <>
            <p className="text-lg text-gray-900 bg-white/90 p-4 rounded-xl border mb-6 shadow-inner font-medium min-h-24 flex items-center">
              <b>System:</b> <span className="ml-2">{assistantText}</span>
            </p>

            {!finished && (
              <div className="flex flex-col items-center gap-4 mb-6">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  disabled={loading}
                  className={`px-8 py-4 text-lg rounded-xl shadow transition font-medium disabled:opacity-50 disabled:cursor-not-allowed
                    ${recording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"}
                    text-white`}
                >
                  {loading ? "Processing..." : recording ? "⏹ Stop Recording" : "🎤 Speak Now"}
                </button>
                {recording && (
                  <p className="text-sm text-gray-600 animate-bounce">
                    🔴 Recording in progress...
                  </p>
                )}
              </div>
            )}

            {finished && (
              <div className="text-center bg-green-50 border border-green-300 p-6 rounded-xl shadow-inner font-medium">
                <h3 className="text-2xl font-semibold text-green-700">✓ Application Submitted!</h3>
                <p className="mt-2 text-gray-700">Your application has been saved and will be reviewed by our team soon.</p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition font-medium"
                >
                  Return Home
                </button>
              </div>
            )}

            {Object.keys(fields).length > 0 && !finished && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 drop-shadow-sm">
                  Collected Information
                </h3>
                <div className="bg-gray-900 text-green-300 p-4 rounded-xl shadow-inner font-mono text-sm">
                  <ul className="space-y-2">
                    {Object.entries(fields).map(([key, value]) => (
                      <li key={key} className="flex justify-between border-b border-green-700/30 pb-1 last:border-b-0">
                        <span className="font-semibold text-green-400">{key.replaceAll("_", " ")}:</span>
                        <span className="text-gray-100">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
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

