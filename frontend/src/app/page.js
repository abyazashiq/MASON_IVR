"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [sessionId, setSessionId] = useState("");
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [fields, setFields] = useState({});
  const [finished, setFinished] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const BACKEND_URL = "http://127.0.0.1:8000";

  // ----------------------------------------
  // Start IVR Button
  // ----------------------------------------
  const handleStart = async () => {
    const sid = crypto.randomUUID();
    setSessionId(sid);

    // Reset backend session
    const formData = new FormData();
    formData.append("session_id", sid);
    await fetch(`${BACKEND_URL}/reset`, {
      method: "POST",
      body: formData,
    });

    // Play intro through backend TTS
    setStarted(true);

    setAssistantText("Starting IVR... Please speak after the tone.");
    setTimeout(() => {
      startRecording();
    }, 2000);
  };

  // ----------------------------------------
  // Start Recording
  // ----------------------------------------
  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      sendAudioToBackend();
    };

    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
  };

  // ----------------------------------------
  // Stop Recording
  // ----------------------------------------
  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  // ----------------------------------------
  // Send audio to IVR backend
  // ----------------------------------------
  const sendAudioToBackend = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", audioBlob, "audio.webm");

    const res = await fetch(`${BACKEND_URL}/ivr`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    console.log("Backend Response:", json);

    setAssistantText(json.assistant_text);
    setFields(json.fields);
    setFinished(json.finished);

    // Play returned audio
    if (json.audio_url) {
      const audio = new Audio(`${BACKEND_URL}${json.audio_url}`);
      audio.play();
    }

    if (!json.finished) {
      // Continue listening
      setTimeout(() => {
        startRecording();
      }, 2000);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mason IVR App</h1>

      {!started && (
        <button
          onClick={handleStart}
          style={{ padding: 12, fontSize: 20, marginBottom: 20 }}
        >
          ▶ Start IVR
        </button>
      )}

      {started && (
        <>
          <p><b>IVR:</b> {assistantText}</p>

          {!finished && (
            <button
              onClick={recording ? stopRecording : startRecording}
              style={{ padding: 12, fontSize: 20 }}
            >
              {recording ? "⏹ Stop Recording" : "🎤 Speak"}
            </button>
          )}

          {finished && (
            <div style={{ marginTop: 20 }}>
              <h3>Session Complete</h3>
              <p>Your data has been saved.</p>
              <button onClick={() => window.location.reload()}>Restart</button>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <h3>Collected Fields</h3>
            <pre>{JSON.stringify(fields, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
