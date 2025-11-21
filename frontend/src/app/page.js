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

  // ----------------------------------------------------------
  // Start IVR
  // ----------------------------------------------------------
  const handleStart = async () => {
    const sid = crypto.randomUUID();
    setSessionId(sid);

    // Reset backend
    const formData = new FormData();
    formData.append("session_id", sid);
    await fetch(`${BACKEND_URL}/reset`, { method: "POST", body: formData });

    setStarted(true);
    setAssistantText("Starting IVR... Please speak after the tone.");

    setTimeout(() => {
      startRecording();
    }, 1500);
  };

  // ----------------------------------------------------------
  // Start Recording
  // ----------------------------------------------------------
  const startRecording = async () => {
    if (finished) {
      console.log("Session finished — refusing to record.");
      return;
    }

    console.log("Recording started");
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      if (!finished) {
        sendAudioToBackend();
      }
    };

    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
  };

  // ----------------------------------------------------------
  // Stop Recording
  // ----------------------------------------------------------
  const stopRecording = () => {
    console.log("Recording stopped");
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // ----------------------------------------------------------
  // Send Audio → Backend
  // ----------------------------------------------------------
  const sendAudioToBackend = async () => {
    if (finished) {
      console.log("Session finished — backend will not be called again.");
      return;
    }

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

    // Play TTS
    if (json.audio_url) {
      const audio = new Audio(`${BACKEND_URL}${json.audio_url}`);
      audio.play();
    }

    // ONLY restart recording if NOT finished
    if (json.finished === false) {
      setTimeout(() => {
        startRecording();
      }, 1500);
    } else {
      console.log("IVR finished — stopping completely.");
      setRecording(false);
    }
  };

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
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

          {/* Speak/Stop button should disappear after finish */}
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
