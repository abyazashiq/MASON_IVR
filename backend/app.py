from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile

from backend.transcribe_module import transcribe_audio
from backend.data_handler import extract_fields
from backend.database import insert_record

app = FastAPI()

# Allow frontend localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe")
async def transcribe_endpoint(file: UploadFile = File(...)):
    try:
        # -------------------------------
        # Save uploaded file temporarily
        # -------------------------------
        suffix = os.path.splitext(file.filename)[-1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_path = tmp.name

        # -------------------------------
        # Run Whisper transcription
        # -------------------------------
        text = transcribe_audio(temp_path)

        # -------------------------------
        # Extract structured fields
        # -------------------------------
        extracted = extract_fields(text)

        name = extracted.get("name")
        number = extracted.get("contact_number")
        address = extracted.get("place")
        pay = extracted.get("wages")
        contact_status = extracted.get("contact_status")

        # -------------------------------
        # Insert into Supabase
        # -------------------------------
        insert_record(
            name=name,
            number=number,
            address=address,
            pay=pay,
            contact_status=contact_status,
            transcription=text
        )

        # -------------------------------
        # Return response
        # -------------------------------
        return {
            "status": "success",
            "transcription": text,
            "extracted": extracted
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
