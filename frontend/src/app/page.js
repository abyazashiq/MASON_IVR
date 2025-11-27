"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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

  // Start IVR
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

  // UI
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative">

      {/* ===== Top Right CTA Button ===== */}
      <button
        onClick={() => router.push("/hire")}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Want to hire masons? Click here
      </button>

      <div className="w-full max-w-2xl mt-10 bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-semibold text-center mb-6">Mason IVR App</h1>

        {!started && (
          <div className="flex justify-center">
            <button
              onClick={handleStart}
              className="px-6 py-3 text-lg bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              ▶ Start IVR
            </button>
          </div>
        )}

        {started && (
          <>
            <p className="text-lg text-gray-800 bg-gray-50 p-4 rounded-lg border mb-6">
              <b>IVR:</b> {assistantText}
            </p>

            {!finished && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className={`px-6 py-3 text-lg rounded-lg shadow transition 
                    ${recording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                    text-white`}
                >
                  {recording ? "⏹ Stop Recording" : "🎤 Speak"}
                </button>
              </div>
            )}

            {finished && (
              <div className="text-center bg-green-50 border border-green-300 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-700">Session Complete</h3>
                <p className="mt-2 text-gray-700">Your data has been saved.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                >
                  Restart
                </button>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Collected Fields</h3>
              <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(fields, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
