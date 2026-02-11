from fastapi import FastAPI, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import tempfile
from pydantic import BaseModel

from backend.transcribe_module import transcribe_audio
from backend.ivr_handler import process_turn, reset_session
from backend.data_handler import insert_record_handler
from backend.database import (
    get_employer_by_id,
    add_employer_profile,
    add_employer_login,
    checklogin,
    get_masons,
    update_contact_status,
)

app = FastAPI(title="Mason IVR Backend", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Models ====================
class EmployerSignup(BaseModel):
    """Request model for employer signup."""
    email: str
    password: str
    name: str
    location: str
    expected_wage: float


# ==================== IVR Endpoints ====================
@app.post("/ivr")
async def ivr_endpoint(session_id: str = Form(...), file: UploadFile = File(...)):
    """Process IVR audio input and return assistant response."""
    try:
        # Save temporary audio file
        suffix = os.path.splitext(file.filename)[-1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_audio_path = tmp.name

        # Transcribe audio
        user_text = transcribe_audio(temp_audio_path)

        # Process user input through IVR logic
        result = process_turn(session_id, user_text)

        # Save to database if session is finished
        if result["finished"]:
            insert_record_handler(result["fields"])

        return {
            "status": "success",
            "assistant_text": result["assistant_text"],
            "finished": result["finished"],
            "fields": result["fields"],
            "audio_url": f"/audio/{os.path.basename(result['audio_file'])}"
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ==================== Audio Endpoint ====================
@app.get("/audio/{file_name}")
async def get_audio(file_name: str):
    """Serve temporary audio files."""
    file_path = os.path.join(tempfile.gettempdir(), file_name)
    return FileResponse(file_path, media_type="audio/mpeg")


# ==================== Session Management ====================
@app.post("/reset")
async def reset(session_id: str = Form(...)):
    """Reset IVR session."""
    reset_session(session_id)
    return {"status": "success", "message": "Session reset"}


# ==================== Employer Endpoints ====================
@app.post("/employer/login")
async def employer_login(email: str = Form(...), password: str = Form(...)):
    """Authenticate employer login."""
    user = checklogin(email, password)
    if user:
        return {"status": "success", "verified": True, "employer": user}
    return {"status": "failed", "verified": False, "message": "Invalid credentials"}


@app.post("/employer/signup")
async def employer_signup(signup: EmployerSignup):
    """Register new employer account."""
    try:
        # Create employer login credentials
        data = add_employer_login(signup.email, signup.password)
        emp_id = data[1]

        # Create employer profile
        add_employer_profile(emp_id, signup.name, signup.location, signup.expected_wage)

        return {"status": "success", "message": "Employer signed up successfully", "emp_id": emp_id}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/employer/{emp_id}")
def get_employer_profile(emp_id: str):
    """Get employer profile by ID."""
    employer = get_employer_by_id(emp_id)
    if not employer:
        return {"name": "", "email": ""}
    return {"name": employer["name"], "email": employer["email"]}


@app.get("/employer/{emp_id}/masons")
def get_masons_for_employer(emp_id: str):
    """Get all collected masons (currently not filtered by employer)."""
    masons = get_masons()
    return {"masons": masons}


@app.put("/masons/{mason_id}/status")
def update_mason_status(mason_id: int, payload: dict = Body(...)):
    """Update mason contact status. Expects { "contact_status": "Contacted" }"""
    new_status = payload.get("contact_status")
    if not new_status:
        return {"status": "error", "updated": False, "message": "contact_status is required"}

    return update_contact_status(mason_id, new_status)


# ==================== Run Server ====================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)   