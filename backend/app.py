from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import os

from backend.transcribe_module import transcribe_audio
from backend.data_handler import extract_fields
from backend.database import insert_record

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/process_audio")
async def process_audio(file: UploadFile = File(...)):
    try:
        # 1. Save file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # 2. Transcribe
        text = transcribe_audio(file_path)

        # 3. Extract structured fields
        data = extract_fields(text)

        # 4. Insert into database
        insert_record(
            name=data["name"],
            address=data["address"],
            wages=data["wages"],
            phone=data["phone"],
            status="pending"
        )

        # 5. Cleanup
        os.remove(file_path)

        # 6. Return result
        return {
            "message": "Data stored successfully",
            "transcription": text,
            "parsed_data": data
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
