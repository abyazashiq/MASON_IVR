from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import tempfile

from backend.transcribe_module import transcribe_audio
from backend.ivr_handler import process_turn, reset_session
from backend.database import insert_record   # <--- IMPORTANT


app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------- IVR -------------------------
@app.post("/ivr")
async def ivr_endpoint(session_id: str = Form(...), file: UploadFile = File(...)):

    try:
        # Save temp audio upload
        suffix = os.path.splitext(file.filename)[-1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_audio_path = tmp.name

        print(f"[IVR] Received audio for session: {session_id}")
        print(f"[IVR] Temp file: {temp_audio_path}")

        # Transcribe user voice
        user_text = transcribe_audio(temp_audio_path)
        print(f"[IVR] Transcription: {user_text}")

        # Process the turn (logic in ivr_handler)
        result = process_turn(session_id, user_text)

        # If all fields are collected, save to database
        if result["finished"]:
            print("[IVR] Session finished. Inserting into DB...")
            insert_record(result["fields"])

        return {
            "status": "success",
            "assistant_text": result["assistant_text"],
            "finished": result["finished"],
            "fields": result["fields"],
            "audio_url": f"/audio/{os.path.basename(result['audio_file'])}"
        }

    except Exception as e:
        print(f"[IVR] Error: {e}")
        return {"status": "error", "message": str(e)}


# ------------------------- Serve audio -------------------------
@app.get("/audio/{file_name}")
async def get_audio(file_name: str):
    file_path = os.path.join(tempfile.gettempdir(), file_name)
    return FileResponse(file_path, media_type="audio/mpeg")


# ------------------------- Reset Session -------------------------
@app.post("/reset")
async def reset(session_id: str = Form(...)):
    reset_session(session_id)
    return {"status": "reset"}


# ------------------------- Run Server -------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

# ------------------------- END -------------------------   