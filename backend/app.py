from fastapi import FastAPI, UploadFile, File, Form,Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import tempfile

from backend.transcribe_module import transcribe_audio
from backend.ivr_handler import process_turn, reset_session
from backend.data_handler import insert_record_handler   # <--- IMPORTANT
from backend.database import get_employer_by_id, add_employer_profile, add_employer_login, checklogin, get_masons, update_contact_status
from pydantic import BaseModel

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------- Model for signup -------------------------
class EmployerSignup(BaseModel):
    email: str
    password: str
    name: str
    location: str
    expected_wage: float


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
            insert_record_handler(result["fields"])

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

@app.post("/employer/login")
async def employer_login(email: str = Form(...), password: str = Form(...)):
    
    # TODO: Replace with database validation
    user = checklogin(email, password)
    if user:
        print(user)
        return {"status": "success", "verified": True, "employer": user}    
    return {"status": "failed", "verified": False}

@app.get("/employer/{emp_id}/masons")
def get_masons_for_employer(emp_id: str):
    """
    Returns the full mason table for the employer.
    Currently fetching all masons; can be filtered later by employer if needed.
    """
    masons = get_masons()  # fetch all masons
    return {"masons": masons}


@app.put("/masons/{mason_id}/status")
def update_mason_status(mason_id: int, payload: dict = Body(...)):
    """
    Expects JSON body: { "contact_status": "Contacted" }
    Returns: { "status": "...", "updated": true/false, ... }
    """
    new_status = payload.get("contact_status")
    if not new_status:
        return {"status": "error", "updated": False, "message": "contact_status is required"}

    result = update_contact_status(mason_id, new_status)
    # result already contains 'updated' boolean
    return result



@app.post("/employer/signup")
async def employer_signup(signup: EmployerSignup):
    # Step 1: Add employer login (email + password)
    data = add_employer_login(signup.email, signup.password)
    emp_id = data[1]  # returned from add_employer_login

    # Step 2: Add employer profile (name + location + wage)
    add_employer_profile(emp_id, signup.name, signup.location, signup.expected_wage)

    return {"status": "success", "message": "Employer signed up successfully."}


@app.get("/employer/{emp_id}")
def get_employer_profile(emp_id: str):
    employer = get_employer_by_id(emp_id)
    if not employer:
        return {"name": "", "email": ""}
    return {"name": employer["name"], "email": employer["email"]}
from fastapi import FastAPI



@app.post("/ivr/save")
async def save(data: dict):
    print("Received:", data)
    return {"ok": True}


# ------------------------- Run Server -------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

# ------------------------- END -------------------------   