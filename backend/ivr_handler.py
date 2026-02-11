from gtts import gTTS
import tempfile
import os
import re

# In-memory session store
SESSIONS = {}

# Fields to collect from user
FIELDS = ["name", "age", "number", "address", "pay"]

# Prompts for each field
QUESTIONS = {
    "name": "Please tell me your full name.",
    "number": "Please tell me your 10-digit phone number.",
    "address": "Please tell me your full address.",
    "pay": "What is your monthly salary or pay?",
    "age": "Please tell me your age."
}


def start_session(session_id: str):
    """Initialize a new IVR session."""
    SESSIONS[session_id] = {f: None for f in FIELDS}
    SESSIONS[session_id]["current_field"] = FIELDS[0]
    SESSIONS[session_id]["awaiting_confirmation"] = False


def reset_session(session_id: str):
    """Reset and clear a session."""
    if session_id in SESSIONS:
        del SESSIONS[session_id]


def synthesize_speech(text: str) -> str:
    """Generate TTS audio file using gTTS and return file path."""
    tts = gTTS(text=text, lang="en")
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tts.save(tmp_file.name)
    return tmp_file.name


def process_turn(session_id: str, user_text: str):
    """Process a user turn with yes/no confirmation."""
    if session_id not in SESSIONS:
        start_session(session_id)

    session = SESSIONS[session_id]
    current_field = session["current_field"]

    print(f"[IVR] User said: '{user_text}'")
# CASE 1: Waiting for YES/NO confirmation
    if session["awaiting_confirmation"]:
        if re.search(r"\b(yes|y)\b", user_text, re.IGNORECASE):
            # User confirmed - move to next field
            session["awaiting_confirmation"] = False
            next_index = FIELDS.index(current_field) + 1

            if next_index < len(FIELDS):
                session["current_field"] = FIELDS[next_index]
                assistant_text = QUESTIONS[session["current_field"]]
                finished = False
            else:
                # All fields collected
                assistant_text = (
                    "All fields collected:\n" +
                    "\n".join([f"{f}: {session[f]}" for f in FIELDS]) +
                    "\nThank you!"
                )
                finished = True
                reset_session(session_id)
        else:
            # User said no - repeat field question
            assistant_text = QUESTIONS[current_field]
            session["awaiting_confirmation"] = False
            finished = False

    # CASE 2: Normal input - save value and ask for confirmation
    else:
        # Special validation for phone number
        if current_field == "number":
            digits = re.sub(r"\D", "", user_text)
            if len(digits) < 10:
                assistant_text = "Please repeat your 10-digit phone number."
                audio_file = synthesize_speech(assistant_text)
                return {
                    "assistant_text": assistant_text,
                    "finished": False,
                    "fields": {f: session.get(f) for f in FIELDS},
                    "audio_file": audio_file
                }
            session["number"] = digits

        # Special validation for age
        elif current_field == "age":
            digits = re.sub(r"\D", "", user_text)
            if not digits or not (18 < int(digits) < 120):
                assistant_text = "I couldn't understand. Please tell me your age as a number."
                audio_file = synthesize_speech(assistant_text)
                return {
                    "assistant_text": assistant_text,
                    "finished": False,
                    "fields": {f: session.get(f) for f in FIELDS},
                    "audio_file": audio_file
                }
            session["age"] = digits

        # Special validation for pay
        elif current_field == "pay":
            digits = re.sub(r"\D", "", user_text)
            if not digits:
                assistant_text = "I couldn't understand. Please tell me your pay as a number."
                audio_file = synthesize_speech(assistant_text)
                return {
                    "assistant_text": assistant_text,
                    "finished": False,
                    "fields": {f: session.get(f) for f in FIELDS},
                    "audio_file": audio_file
                }
            session["pay"] = digits

        else:
            session[current_field] = user_text.strip()

        # Ask for confirmation
        assistant_text = (
            f"Is this your {current_field}: {session[current_field]}? "
            "Say yes to confirm, or no to repeat."
        )
        session["awaiting_confirmation"] = True
        finished = False

    # Generate TTS output
    audio_file = synthesize_speech(assistant_text)

    return {
        "assistant_text": assistant_text,
        "finished": finished,
        "fields": {f: session.get(f) for f in FIELDS},
        "audio_file": audio_file
    }