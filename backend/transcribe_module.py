"""Audio transcription using HuggingFace Spaces Whisper API."""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

# HuggingFace Spaces API endpoint for Whisper
WHISPER_API_URL = os.getenv(
    "WHISPER_API_URL",
    "https://placeholder-mason-whisper-api.hf.space/transcribe"
)


def transcribe_audio(file_path: str) -> str:
    """
    Transcribe audio file using HuggingFace Spaces Whisper API.
    
    Args:
        file_path: Path to audio file (wav, mp3, etc.)
        
    Returns:
        Transcribed text
        
    Raises:
        FileNotFoundError: If audio file doesn't exist
        RuntimeError: If transcription fails
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    try:
        with open(file_path, "rb") as f:
            files = {"file": f}
            response = requests.post(WHISPER_API_URL, files=files, timeout=60)
            response.raise_for_status()
            result = response.json()
            return result["text"].strip()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Transcription API failed: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Transcription failed: {str(e)}")
