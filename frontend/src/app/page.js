"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      sendAudioToBackend();
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const sendAudioToBackend = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", audioBlob,"audio.wav");

    const res = await fetch("http://127.0.0.1:8000/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setTranscript(data.transcript || "No transcription");
    setResponse(data.response || "No response");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>MASON IVR</h1>

      {!recording ? (
        <button onClick={startRecording} style={{ padding: "10px 20px" }}>
          🎤 Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} style={{ padding: "10px 20px" }}>
          ⛔ Stop Recording
        </button>
      )}

      <div style={{ marginTop: "20px" }}>
        <h2>Transcript:</h2>
        <p>{transcript}</p>

        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}
