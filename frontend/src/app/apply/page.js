"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const sessionIdRef = useRef(""); // Add ref for guaranteed session ID
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
  const MAX_RETRIES = 3;

  const handleStart = async () => {
    try {
      setError("");
      setLoading(true);
      
      // Create session ID and store in both state and ref
      const sid = crypto.randomUUID();
      console.log("[DEBUG] Created session ID:", sid);
      setSessionId(sid);
      sessionIdRef.current = sid; // Store in ref for guaranteed access

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
        console.log("[DEBUG] Starting recording with session_id ref:", sessionIdRef.current);
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

    // Use ref for guaranteed session ID access (state might not be updated yet)
    const currentSessionId = sessionIdRef.current;
    
    if (!currentSessionId || currentSessionId.trim() === "") {
      setError("Session not initialized. Please restart the application.");
      setRecording(false);
      console.error("[ERROR] Session ID is empty:", currentSessionId);
      return;
    }

    try {
      setLoading(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      if (audioBlob.size === 0) {
        throw new Error("Audio blob is empty");
      }

      const formData = new FormData();
      formData.append("session_id", currentSessionId);
      formData.append("file", audioBlob, "audio.webm");

      console.log("[DEBUG] Sending to backend:", {
        url: `${BACKEND_URL}/ivr`,
        sessionId: currentSessionId,
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
    <div className="min-h-screen bg-beige flex flex-col relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-clay shadow-neomorph sticky top-0 z-50 border-b-4 border-navy">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-black text-white hover:opacity-90 transition-opacity duration-300"
          >
            MASON-IVR
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/contact")}
              className="px-5 py-2 bg-navy text-white font-bold text-sm rounded-lg hover:bg-opacity-80 transition-all duration-300"
            >
              Contact Us
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2 bg-navy text-white font-bold text-sm rounded-lg hover:bg-opacity-80 transition-all duration-300"
            >
              ← Back Home
            </button>
          </div>
        </div>
      </nav>

      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-navy opacity-5 rounded-lg"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-clay opacity-4 rounded-full"></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-6 relative z-10">
        {/* Main Card */}
        <div className="w-full max-w-2xl bg-surface-light shadow-neomorph rounded-lg p-10 border border-navy border-opacity-5 animate-slide-up">
        {/* Heading */}
        <h1 className="text-4xl font-black text-navy text-center mb-2">
          Apply as a Mason
        </h1>

        {/* Decorative underline */}
        <div className="w-20 h-1 bg-clay rounded-full mx-auto mb-8"></div>

        {/* Subheading */}
        <p className="text-center text-lg text-slate mb-6">
          Join our network of skilled professionals. This voice-based interview will take 5-10 minutes.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 bg-error bg-opacity-10 border-l-4 border-error rounded-lg animate-fade-in">
            <p className="font-bold text-error text-base flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              {error}
            </p>
            <button
              onClick={() => setError("")}
              className="mt-3 text-sm font-bold text-error underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Status Message */}
        {loading && (
          <div className="mb-6 p-5 bg-warning bg-opacity-10 border-l-4 border-warning rounded-lg animate-pulse">
            <p className="font-bold text-warning text-base flex items-center gap-2">
              <span className="text-2xl animate-spin">⏳</span>
              {assistantText || "Processing your audio..."}
            </p>
          </div>
        )}

        {/* Before Start State */}
        {!started && (
          <div className="flex flex-col items-center gap-6">
            <div className="bg-beige p-8 rounded-lg border-2 border-clay border-opacity-20 w-full">
              <p className="text-center text-lg text-navy font-bold mb-4">
                📋 Before You Start
              </p>
              <ul className="space-y-3 text-base text-navy font-semibold">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🎤</span>
                  Make sure your microphone is enabled
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🔇</span>
                  Find a quiet space
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🗣️</span>
                  Speak clearly when prompted
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  Application takes 5-10 minutes
                </li>
              </ul>
            </div>

            <button
              className="btn-primary py-6 px-12 text-2xl font-black w-full rounded-lg hover:shadow-lg transform transition-all duration-400 active:scale-95"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? "⏳ Initializing..." : "🎙️ Start Application"}
            </button>
          </div>
        )}

        {/* During Interview State */}
        {started && (
          <>
            {/* Assistant Message Display */}
            <div className="mb-8 bg-navy bg-opacity-5 p-6 rounded-lg border-2 border-navy border-opacity-10 min-h-32 flex flex-col justify-center">
              <p className="text-sm font-bold text-slate uppercase tracking-wide mb-2">
                System Message
              </p>
              <p className="text-2xl font-bold text-navy leading-relaxed">
                {assistantText}
              </p>
            </div>

            {/* Recording Controls */}
            {!finished && (
              <div className="flex flex-col items-center gap-6 mb-8">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  disabled={loading}
                  className={`px-12 py-6 text-2xl font-black rounded-lg shadow-lg transform transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-20 flex items-center justify-center gap-3
                    ${
                      recording
                        ? "bg-error text-white animate-pulse hover:bg-red-600"
                        : "bg-clay text-white hover:bg-orange-600"
                    }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Processing...
                    </>
                  ) : recording ? (
                    <>
                      <span>⏹</span>
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <span>🎤</span>
                      Speak Now
                    </>
                  )}
                </button>
                
                {recording && (
                  <div className="flex items-center gap-2 text-lg font-bold text-error">
                    <span className="text-2xl animate-bounce">🔴</span>
                    Recording in progress...
                  </div>
                )}
              </div>
            )}

            {/* Finished State */}
            {finished && (
              <div className="text-center bg-success bg-opacity-10 border-2 border-success p-8 rounded-lg mb-6 animate-scale-in">
                <h3 className="text-4xl font-black text-success mb-3">✓</h3>
                <h2 className="text-3xl font-black text-navy mb-2">
                  Application Submitted!
                </h2>
                <p className="text-lg text-navy mb-6">
                  Your application has been saved and will be reviewed by our team within 24 hours.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="btn-primary py-4 px-8 text-lg font-bold rounded-lg"
                >
                  Return Home
                </button>
              </div>
            )}

            {/* Collected Information Display */}
            {Object.keys(fields).length > 0 && !finished && (
              <div className="mt-8 p-6 bg-beige border-2 border-navy border-opacity-10 rounded-lg">
                <h3 className="text-xl font-black text-navy mb-4 flex items-center gap-2">
                  <span>📝</span> Collected Information
                </h3>
                <div className="space-y-3">
                  {Object.entries(fields).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-start gap-4 pb-3 border-b border-navy border-opacity-10 last:border-b-0"
                    >
                      <span className="font-bold text-navy text-base">
                        {key.replaceAll("_", " ")}:
                      </span>
                      <span className="text-navy font-semibold text-right max-w-xs">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
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
          .animate-slide-up,
          .animate-scale-in,
          .animate-pulse {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

