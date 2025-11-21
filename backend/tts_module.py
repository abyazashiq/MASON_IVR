from dotenv import load_dotenv

import tempfile
from openai import OpenAI

load_dotenv()  # <-- loads .env file


client = OpenAI()

def synthesize_speech(text: str, voice: str = "alloy") -> str:
    """
    Convert text to speech using OpenAI’s TTS model.
    
    Args:
        text (str): Text to convert.
        voice (str): Voice style ("alloy", "verse", etc.)
    
    Returns:
        str: Path to generated mp3 audio file.
    """
    try:
        # Ask OpenAI to create a TTS speech stream
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice=voice,
            input=text
        )

        # Make a temporary .mp3 file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            fp.write(response.read())
            file_path = fp.name

        return file_path

    except Exception as e:
        raise RuntimeError(f"TTS generation failed: {str(e)}")
