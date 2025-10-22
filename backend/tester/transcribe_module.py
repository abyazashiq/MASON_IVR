from pydub import AudioSegment
import whisper
import os


def transcribe_audio(file_path: str) -> str:
    """
    Transcribes an MP3 or WAV file using OpenAI Whisper (CPU mode).
    Converts MP3 → WAV for better decoding.
    """

    # --- Validate file ---
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    # --- Convert MP3 to WAV if needed ---
    if file_path.lower().endswith(".mp3"):
        wav_path = file_path.replace(".mp3", ".wav")
        audio = AudioSegment.from_file(file_path, format="mp3")
        audio.export(wav_path, format="wav")
    else:
        wav_path = file_path

    # --- Load Whisper model (CPU) ---
    model = whisper.load_model("tiny")  # change to 'base' or 'small' if needed

    # --- Transcribe ---
    result = model.transcribe(wav_path)
    text = result["text"].strip()

    # --- Optional cleanup ---
    if file_path.lower().endswith(".mp3") and os.path.exists(wav_path):
        os.remove(wav_path)

    return text
