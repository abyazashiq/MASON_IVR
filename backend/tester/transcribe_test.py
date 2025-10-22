import os
from transcribe_module import transcribe_audio

if __name__ == "__main__":
    audio_file = "testaudio.mp3"  # replace with your file path
    if not os.path.exists(audio_file):
        print(f"File not found: {audio_file}")
    else:
        text = transcribe_audio(audio_file)
        print("Transcription result:")
        print(text)
