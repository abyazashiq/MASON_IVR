"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","700"] });

export default function Home() {
  const [sessionId, setSessionId] = useState("");
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [fields, setFields] = useState({});
  const [finished, setFinished] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const router = useRouter();

  const BACKEND_URL = "http://127.0.0.1:8000";

  const handleStart = async () => {
    const sid = crypto.randomUUID();
    setSessionId(sid);

    const formData = new FormData();
    formData.append("session_id", sid);
    await fetch(`${BACKEND_URL}/reset`, { method: "POST", body: formData });

    setStarted(true);
    setAssistantText("Starting IVR... Please speak after the tone.");

    setTimeout(() => {
      startRecording();
    }, 1500);
  };

  const startRecording = async () => {
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
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const sendAudioToBackend = async () => {
    if (finished) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", audioBlob, "audio.webm");

    const res = await fetch(`${BACKEND_URL}/ivr`, {
      method: "POST",
      body: formData,
    });

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

      {/* Top Right CTA */}
      <button
        onClick={() => router.push("/hire")}
        className="absolute top-4 right-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg shadow-lg hover:bg-yellow-400 transition font-medium"
      >
        Want to hire masons? Click here
      </button>

      {/* Main Card */}
      <div className="w-full max-w-2xl mt-10 bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/30">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900 drop-shadow-md">
          Mason IVR App
        </h1>

        {!started && (
          <div className="flex justify-center">
            <button
              className="px-6 py-3 text-lg bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition font-medium"
              onClick={handleStart}
            >
              Start IVR
            </button>
          </div>
        )}

        {started && (
          <>
            <p className="text-lg text-gray-900 bg-white/90 p-4 rounded-xl border mb-6 shadow-inner font-medium">
              <b>IVR:</b> {assistantText}
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
                <h3 className="text-2xl font-semibold text-green-700">Session Complete</h3>
                <p className="mt-2 text-gray-700">Your data has been saved.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition font-medium"
                >
                  Restart
                </button>
              </div>
            )}

            <div className="mt-8">
  <h3 className="text-xl font-semibold mb-4 text-gray-900 drop-shadow-sm">
    Collected Fields
  </h3>
  {Object.keys(fields).length === 0 ? (
    <p className="text-gray-700 italic">No data collected yet.</p>
  ) : (
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
  )}
</div>
          </>
        )}

        {/* Detailed explanation */}
        <div className="mt-10 bg-white/90 p-6 rounded-xl shadow-inner border border-white/30 font-medium text-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">About the Mason IVR System</h2>
          <p className="mb-3">
            The Mason IVR System is a web-based Interactive Voice Response application specifically designed
            to assist users in collecting, recording, and managing information related to masonry services.
            Its primary purpose is to automate and streamline the process of gathering client requirements
            and preferences without requiring direct human supervision.
          </p>
          <p className="mb-3">
            Users interact with the system through voice commands. The IVR captures spoken inputs, converts
            them into structured data, and stores them in a secure backend. This ensures that all relevant
            details such as client contact information, project specifications, and other important fields
            are accurately recorded for further processing.
          </p>
          <p className="mb-3">
            The system is particularly useful for construction companies, masonry contractors, or organizations
            that require quick and reliable data collection from clients. By automating the intake process,
            the Mason IVR System reduces manual errors, saves time, and provides a clear digital record
            of all interactions.
          </p>
          <p className="mb-3">
            In essence, this IVR system exists to improve efficiency, maintain data consistency, and
            provide an intuitive, voice-driven interface for collecting important information from
            users. It is an essential tool for modern masonry service providers seeking to enhance
            operational productivity and client satisfaction.
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
