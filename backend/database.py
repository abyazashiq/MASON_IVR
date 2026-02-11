# supabase_db.py
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables from .env
from dotenv import load_dotenv
import os

import bcrypt
import uuid


load_dotenv(dotenv_path="D:\Link_from_C\Mason_IVR\.env")


SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# Initialize Supabase client once (write-only)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def insert_record(name=None, number=None, address=None, pay=None,age=None, contact_status="Pending", transcription=None):
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
        "transcription": transcription,
        "age":age
    }
    response = supabase.table("calls").insert(data).execute()
    return response.data  # Returns success info, but not the full table


def checklogin(email, password):
    response = supabase.table("employers").select("*").eq("email", email).execute()
    if response.data:
        
        user = response.data[0]
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return user
        
    return None

def add_employer_login( email, password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    emp_id= str(uuid.uuid4())
    data = {
        
        "email": email,
        "password": hashed_password,
        "emp_id": emp_id
    }
    response = supabase.table("employers").insert(data).execute()
    return (response.data,emp_id)

def add_employer_profile(emp_id, name, location, expected_wage):
    data = {
        "emp_id": emp_id,
        "location": location,
        "expected_wage": expected_wage, 
        "name": name,
        
    }
    response = supabase.table("employer_profiles").insert(data).execute()
    return response.data

def get_employer_by_id(emp_id):
    # Fetch profile from employer_profiles
    profile_res = supabase.table("employer_profiles").select("*").eq("emp_id", emp_id).execute()
    profile = profile_res.data[0] if profile_res.data else None

    # Fetch email from employer table
    employer_res = supabase.table("employers").select("email").eq("emp_id", emp_id).execute()
    employer = employer_res.data[0] if employer_res.data else None

    if not profile and not employer:
        return None

    return {
        "name": profile.get("name", "Unknown") if profile else "Unknown",
        "email": employer.get("email", "Unknown") if employer else "Unknown"
    }

def get_masons():
    response = supabase.table("calls").select("*").execute()
    # response.data will either be a list of rows or None
    if response.data is None:
        return []
    return response.data


def update_contact_status(mason_id: int, new_status: str):
    """
    Update the contact_status column for a row with id = mason_id.
    Returns a dict with updated flag so frontend can use data.updated.
    """
    try:
        # Make sure column name is exactly what you have in Supabase (contact_status)
        response = supabase.table("calls").update({"contact_status": new_status}).eq("id", mason_id).execute()

        # In the current SDK, response.data will be a list of updated rows (or None/empty)
        if response.data:
            # response.data[0] is the updated row
            return {"status": "success", "updated": True, "row": response.data[0]}
        else:
            return {"status": "error", "updated": False, "message": "No rows updated (id not found or no change)"}
    except Exception as e:
        print("update_contact_status error:", e)
        return {"status": "error", "updated": False, "message": str(e)}