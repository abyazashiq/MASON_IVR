# supabase_db.py
"""Database functions for Mason IVR system."""

from supabase import create_client
import os
from dotenv import load_dotenv
import bcrypt
import uuid

# Load environment variables from .env (works locally and on Render)
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# Initialize Supabase client once
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def insert_record(name=None, number=None, address=None, pay=None, age=None, 
                  contact_status="Pending", transcription=None):
    """Insert a new call record into the calls table."""
    data = {
        "name": name,
        "number": number,
        "address": address,
        "pay": pay,
        "contact_status": contact_status,
        "transcription": transcription,
        "age": age
    }
    response = supabase.table("calls").insert(data).execute()
    return response.data


def checklogin(email, password):
    """Verify employer login credentials."""
    response = supabase.table("employers").select("*").eq("email", email).execute()
    if response.data:
        user = response.data[0]
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return user
    return None


def add_employer_login(email, password):
    """Create employer login account with hashed password."""
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    emp_id = str(uuid.uuid4())
    data = {
        "email": email,
        "password": hashed_password,
        "emp_id": emp_id
    }
    response = supabase.table("employers").insert(data).execute()
    return (response.data, emp_id)


def add_employer_profile(emp_id, name, location, expected_wage):
    """Create employer profile."""
    data = {
        "emp_id": emp_id,
        "location": location,
        "expected_wage": expected_wage,
        "name": name,
    }
    response = supabase.table("employer_profiles").insert(data).execute()
    return response.data


def get_employer_by_id(emp_id):
    """Fetch employer profile and email by ID."""
    profile_res = supabase.table("employer_profiles").select("*").eq("emp_id", emp_id).execute()
    profile = profile_res.data[0] if profile_res.data else None

    employer_res = supabase.table("employers").select("email").eq("emp_id", emp_id).execute()
    employer = employer_res.data[0] if employer_res.data else None

    if not profile and not employer:
        return None

    return {
        "name": profile.get("name", "Unknown") if profile else "Unknown",
        "email": employer.get("email", "Unknown") if employer else "Unknown"
    }


def get_masons():
    """Fetch all collected mason records."""
    response = supabase.table("calls").select("*").execute()
    return response.data if response.data else []


def update_contact_status(mason_id: int, new_status: str):
    """Update the contact status for a mason."""
    try:
        response = supabase.table("calls").update({"contact_status": new_status}).eq("id", mason_id).execute()

        if response.data:
            return {"status": "success", "updated": True, "row": response.data[0]}
        else:
            return {"status": "error", "updated": False, "message": "No rows updated (id not found)"}
    except Exception as e:
        return {"status": "error", "updated": False, "message": str(e)}