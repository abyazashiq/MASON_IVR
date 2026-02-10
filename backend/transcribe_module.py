import os
import tempfile
import whisper

# Load model ONCE (very important for performance)
MODEL_NAME = "tiny"  # use "base" if accuracy > speed
model = whisper.load_model(MODEL_NAME)


def transcribe_audio(file_path: str) -> str:
    """
    Transcribes WAV/MP3 audio using OpenAI Whisper (CPU).
    FFmpeg-free if input is WAV.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    # Whisper can directly handle WAV files safely
    # MP3 may require FFmpeg depending on environment
    try:
        result = model.transcribe(
            file_path,
            fp16=False,       # CPU-safe
            language="en"     # lock language for speed
        )
    except Exception as e:
        raise RuntimeError(f"Transcription failed: {str(e)}")

    return result["text"].strip()
