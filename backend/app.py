from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import tempfile

from backend.transcribe_module import transcribe_audio
from backend.ivr_handler import process_turn, reset_session

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_URL = "http://127.0.0.1:8000"

# ------------------------- IVR -------------------------
@app.post("/ivr")
async def ivr_endpoint(session_id: str = Form(...), file: UploadFile = File(...)):
    try:
        suffix = os.path.splitext(file.filename)[-1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_audio_path = tmp.name

        print(f"[IVR] Received recording for session: {session_id}")
        print(f"[IVR] Saved audio temporarily at: {temp_audio_path}")

        # Transcribe audio
        user_text = transcribe_audio(temp_audio_path)
        print(f"[IVR] Transcribed text: '{user_text}'")

        # Process turn
        result = process_turn(session_id, user_text)

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

# ------------------------- Reset -------------------------
@app.post("/reset")
async def reset(session_id: str = Form(...)):
    reset_session(session_id)
    return {"status": "reset"}

# ------------------------- Run server -------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
