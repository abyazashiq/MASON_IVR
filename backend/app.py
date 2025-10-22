from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.transcribe_module import transcribe_audio
from backend.database import get_db, create_mason, get_available_masons, create_ivr_session, update_session_progress, IVRSession
from backend.ivr_handler import IVRHandler
import imageio_ffmpeg as ffmpeg
import os
from backend.database import init_db

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ivr_handler = IVRHandler()

def parse_mason_responses(session):
    responses = session.responses or []
    try:
        rate = float(''.join(filter(str.isdigit, responses[2]))) if len(responses) > 2 else 0.0
        return {
            "name": responses[0] if len(responses) > 0 else "",
            "location": responses[1] if len(responses) > 1 else "",
            "rate": rate
        }
    except (ValueError, IndexError):
        return {"name": "", "location": "", "rate": 0.0}

@app.on_event("startup")
async def startup_event():
    init_db()

@app.post("/transcribe")
async def transcribe_endpoint(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Run transcription
        text = transcribe_audio(file_path)

        # Optional: delete file after processing
        os.remove(file_path)

        return {"text": text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/get-question/{question_index}")
async def get_question(question_index: int):
    question = ivr_handler.get_next_question(question_index)
    if question:
        return {"question": question}
    return JSONResponse(status_code=404, content={"error": "No more questions"})

@app.get("/available-masons")
async def get_masons(db=Depends(get_db)):
    masons = get_available_masons(db)
    return [{"id": m.id, "name": m.name, "location": m.location, "rate": m.expected_rate} for m in masons]

@app.post("/start-session")
async def start_session(db=Depends(get_db)):
    session = create_ivr_session(db)
    return {"session_id": session.id}

@app.post("/transcribe/{session_id}")
async def transcribe_with_session(
    session_id: int,
    file: UploadFile = File(...),
    db=Depends(get_db)
):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        text = transcribe_audio(file_path)
        os.remove(file_path)

        current_session = db.query(IVRSession).filter(IVRSession.id == session_id).first()
        if not current_session:
            return JSONResponse(status_code=404, content={"error": "Session not found"})

        session = update_session_progress(db, session_id, current_session.question_index + 1, text)
        
        if session.completed:
            parsed_data = parse_mason_responses(session)
            try:
                create_mason(db, 
                    name=parsed_data["name"],
                    location=parsed_data["location"],
                    expected_rate=parsed_data["rate"]
                )
            except Exception as e:
                return JSONResponse(status_code=400, content={"error": f"Failed to create mason: {str(e)}"})

        return {"text": text, "completed": session.completed}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
