    "use client";

    import { useState, useEffect } from "react";

    // Extend Window type to include SpeechRecognition
    declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
    }

    export default function MasonChat() {
    const [conversation, setConversation] = useState<string[]>([]);
    const [listening, setListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        // Setup Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser.");
        return;
        }

        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.lang = "en-IN";
        recog.interimResults = false;
        recog.maxAlternatives = 1;

        recog.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setConversation((prev) => [...prev, `You: ${text}`]);
        sendToAssistant(text);
        setListening(false);
        };

        recog.onend = () => setListening(false);

        setRecognition(recog);
    }, []);

    const startListening = () => {
        if (recognition) {
        setListening(true);
        recognition.start();
        }
    };

    const sendToAssistant = async (userText: string) => {
        try {
        const res = await fetch("/api/mason-assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userText }),
        });
        const data = await res.json();
        const assistantReply = data.reply;

        setConversation((prev) => [...prev, `Assistant: ${assistantReply}`]);

        // Speak the assistant reply
        const speech = new SpeechSynthesisUtterance(assistantReply);
        speech.lang = "en-IN";
        window.speechSynthesis.speak(speech);
        } catch (err) {
        console.error(err);
        setConversation((prev) => [...prev, `Assistant: Sorry, there was an error.`]);
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mason Voice Chat</h1>
        <div className="border p-4 h-80 overflow-y-auto mb-4">
            {conversation.map((msg, idx) => (
            <p key={idx} className="mb-2">{msg}</p>
            ))}
        </div>
        <button
            onClick={startListening}
            className={`px-4 py-2 rounded ${listening ? "bg-red-500" : "bg-blue-500"} text-white`}
        >
            {listening ? "Listening..." : "Talk"}
        </button>
        </div>
    );
    }
