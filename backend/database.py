# supabase_db.py
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables from .env
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="D:\Link_from_C\Mason_IVR\.env")


SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# Initialize Supabase client once (write-only)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def insert_record(name=None, number=None, address=None, pay=None, contact_status=None, transcription=None):
    """
    Inserts a new call record into the 'calls' table.
    Write-only: No retrieval of data is allowed here.
    """
    data = {
        "name": name,
        "number": number,
        "address": address,
        "pay": pay,
        "contact_status": contact_status,
        "transcription": transcription
    }
    response = supabase.table("calls").insert(data).execute()
    return response.data  # Returns success info, but not the full table