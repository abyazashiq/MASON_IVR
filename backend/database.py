from supabase import create_client
import os
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Example: insert a new call
def insert_call(user_id, name, number, address, pay, contact_status, transcription):
    data = {
        "user_id": user_id,
        "name": name,
        "number": number,
        "address": address,
        "pay": pay,
        "contact_status": contact_status,
        "transcription": transcription
    }
    response = supabase.table("calls").insert(data).execute()
    print(response.data)

# Example: fetch calls for logged-in user
def get_calls(user_id):
    response = supabase.table("calls").select("*").eq("user_id", user_id).execute()
    return response.data

# Usage example
if __name__ == "__main__":
    user_id = "put-user-uuid-here"  # Supabase auth user ID
    insert_call(user_id, "John Doe", "9999999999", "123 Street", 1000, "Pending", "Hello world transcription")
    print(get_calls(user_id))
