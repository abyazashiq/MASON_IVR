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
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  const handleStart = async () => {
    try {
      setError("");
      const sid = crypto.randomUUID();
      setSessionId(sid);

      const formData = new FormData();
      formData.append("session_id", sid);
      
      const response = await fetch(`${BACKEND_URL}/reset`, { 
        method: "POST", 
        body: formData 
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      setStarted(true);
      setAssistantText("Starting IVR... Please speak after the tone.");

      setTimeout(() => {
        startRecording();
      }, 1500);
    } catch (err) {
      setError(`Failed to start IVR: ${err.message}`);
      console.error(err);
    }
  };

  const startRecording = async () => {
    try {
      if (finished) return;
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      mediaRecorderRef.current.onstop = () => {
        if (!finished) sendAudioToBackend();
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      setError(`Microphone access denied: ${err.message}`);
      console.error(err);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const sendAudioToBackend = async () => {
    if (finished) return;

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("file", audioBlob, "audio.webm");

      const res = await fetch(`${BACKEND_URL}/ivr`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const json = await res.json();

      setAssistantText(json.assistant_text);
      setFields(json.fields);
      setFinished(json.finished);

      if (json.audio_url) {
        new Audio(`${BACKEND_URL}${json.audio_url}`).play();
      }

      if (!json.finished) {
        setTimeout(() => startRecording(), 1500);
      }
    } catch (err) {
      setError(`Error processing audio: ${err.message}`);
      console.error(err);
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
        className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg shadow-lg hover:bg-gray-300 transition font-medium"
      >
        ← Back Home
      </button>

      {/* Main Card */}
      <div className="w-full max-w-2xl mt-10 bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/30">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900 drop-shadow-md">
          Apply as a Mason
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {!started && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-gray-700 mb-4">
              Click the button below to start your application. You'll be guided through a voice-based interview.
            </p>
            <button
              className="px-6 py-3 text-lg bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition font-medium"
              onClick={handleStart}
            >
              Start Application
            </button>
          </div>
        )}

        {started && (
          <>
            <p className="text-lg text-gray-900 bg-white/90 p-4 rounded-xl border mb-6 shadow-inner font-medium">
              <b>System:</b> {assistantText}
            </p>

            {!finished && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className={`px-6 py-3 text-lg rounded-xl shadow transition font-medium
                    ${recording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
                    text-white`}
                >
                  {recording ? "Stop Recording" : "Speak"}
                </button>
              </div>
            )}

            {finished && (
              <div className="text-center bg-green-50 border border-green-300 p-6 rounded-xl shadow-inner font-medium">
                <h3 className="text-2xl font-semibold text-green-700">Application Submitted!</h3>
                <p className="mt-2 text-gray-700">Your application has been saved and will be reviewed soon.</p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition font-medium"
                >
                  Return Home
                </button>
              </div>
            )}

            {Object.keys(fields).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 drop-shadow-sm">
                  Your Information
                </h3>
                <div className="bg-gray-900 text-green-300 p-4 rounded-xl shadow-inner font-medium">
                  <ul className="space-y-2">
                    {Object.entries(fields).map(([key, value]) => (
                      <li key={key} className="flex justify-between border-b border-green-700/30 pb-1 last:border-b-0">
                        <span className="font-semibold">{key.replaceAll("_", " ")}:</span>
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
