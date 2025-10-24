from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="D:\Link_from_C\Mason_IVR\.env") # loads .env

print("SUPABASE_URL =", os.environ.get("SUPABASE_URL"))
print("SUPABASE_SERVICE_KEY =", os.environ.get("SUPABASE_SERVICE_KEY"))
