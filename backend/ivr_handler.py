from gtts import gTTS
import tempfile
import os
import re

# Import your database handler
from backend.database import insert_record

# In-memory session store
SESSIONS = {}

FIELDS = ["name", "age", "place", "wages"]

QUESTIONS = {
    "name": "Please tell me your full name.",
    "age": "What is your age?",
    "place": "Which city or place do you live in?",
    "wages": "What is your monthly wage?"
}

def start_session(session_id: str):
    """Initialize a new IVR session."""
    SESSIONS[session_id] = {f: None for f in FIELDS}
    SESSIONS[session_id]["current_field"] = FIELDS[0]
    SESSIONS[session_id]["awaiting_confirmation"] = False
    print(f"[IVR] Session {session_id} started.")

def reset_session(session_id: str):
    if session_id in SESSIONS:
        del SESSIONS[session_id]
    print(f"[IVR] Session {session_id} reset.")

def synthesize_speech(text: str) -> str:
    """Generate TTS audio file and return file path."""
    tts = gTTS(text=text, lang="en")
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tts.save(tmp_file.name)
    print(f"[IVR] TTS audio generated: {tmp_file.name}")
    return tmp_file.name


def process_turn(session_id: str, user_text: str):
    """Process a user turn with yes/no confirmation."""
    if session_id not in SESSIONS:
        start_session(session_id)

    session = SESSIONS[session_id]
    current_field = session["current_field"]

    print(f"[IVR] User input for session {session_id}: '{user_text}'")

    # ──────────────────────────────────────────────
    # CASE 1 — Waiting for YES/NO confirmation
    # ──────────────────────────────────────────────
    if session.get("awaiting_confirmation"):

        # YES → confirm and move forward
        if re.search(r"\b(yes|y)\b", user_text, re.IGNORECASE):
            session["awaiting_confirmation"] = False

            next_index = FIELDS.index(current_field) + 1

            # If there ARE more fields
            if next_index < len(FIELDS):
                session["current_field"] = FIELDS[next_index]
                assistant_text = QUESTIONS[session["current_field"]]
                finished = False

            # If FINAL field confirmed
            else:
                assistant_text = (
                    "All fields collected:\n" +
                    "\n".join([f"{f}: {session[f]}" for f in FIELDS]) +
                    "\nThank you!"
                )
                finished = True

                # 🔥 SAVE TO DATABASE HERE
                try:
                    insert_record({
                        "name": session["name"],
                        "age": session["age"],
                        "place": session["place"],
                        "wages": session["wages"]
                    })
                    print("[DB] Record inserted successfully.")
                except Exception as e:
                    print("[DB ERROR]", e)

                # Reset session after saving
                reset_session(session_id)

        else:
            # NO → repeat same question
            assistant_text = QUESTIONS[current_field]
            finished = False
            session["awaiting_confirmation"] = False

    # ──────────────────────────────────────────────
    # CASE 2 — Normal input, store value and ask confirm
    # ──────────────────────────────────────────────
    else:
        session[current_field] = user_text.strip()
        print(f"[IVR] Saved '{current_field}' = '{session[current_field]}'")

        assistant_text = (
            f"Is this your {current_field}: {session[current_field]}? "
            "Say yes to confirm, no to repeat."
        )

        session["awaiting_confirmation"] = True
        finished = False

    # Generate TTS audio file
    audio_file = synthesize_speech(assistant_text)
    print(f"[IVR] Asking: {assistant_text}")

    return {
        "assistant_text": assistant_text,
        "finished": finished,
        "fields": {f: session.get(f) for f in FIELDS},
        "audio_file": audio_file
    }
