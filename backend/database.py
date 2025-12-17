"""
data_handler.py — Handles extraction and storage of IVR transcription data into PostgreSQL.

Table schema:
    id SERIAL PRIMARY KEY
    name TEXT
    address TEXT
    pay TEXT
    number TEXT
    contact_status TEXT
"""

import re
import psycopg2
from psycopg2.extras import RealDictCursor


# ===============================================================
# 1. DATABASE CONNECTION
# ===============================================================
def get_connection():
    """
    Returns a connection to the PostgreSQL database.
    Update credentials according to your environment.
    """
    return psycopg2.connect(
        host="localhost",          # e.g., 'db.neon.tech' if remote
        database="mason_ivr",
        user="postgres",
        password="yourpassword",
        cursor_factory=RealDictCursor
    )


# ===============================================================
# 2. INITIALIZE TABLE
# ===============================================================
def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS call_data (
        id SERIAL PRIMARY KEY,
        name TEXT,
        address TEXT,
        pay TEXT,
        number TEXT,
        contact_status TEXT
    )
    """)
    conn.commit()
    cur.close()
    conn.close()


# ===============================================================
# 3. PARSE TRANSCRIPTION TEXT
# ===============================================================
def parse_transcription(text: str):
    """
    Extracts name, address, and pay fields from raw transcription text.
    Example input:
        "My name is John Doe. I live at 24 Palm Street, Chennai. My pay is 45000."
    """

    name_match = re.search(r"(?:name is|I'm|I am)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)", text)
    address_match = re.search(r"(?:live at|address is|stay at)\s+(.+?)(?:\.|$)", text)
    pay_match = re.search(r"(?:pay is|salary is|income is)\s+(\d+)", text)

    name = name_match.group(1).strip() if name_match else "Unknown"
    address = address_match.group(1).strip() if address_match else "Unknown"
    pay = pay_match.group(1).strip() if pay_match else "Unknown"

    return name, address, pay


# ===============================================================
# 4. INSERT DATA
# ===============================================================
def store_data(name, address, pay, number, contact_status):
    """
    Inserts a single record into call_data table.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO call_data (name, address, pay, number, contact_status)
        VALUES (%s, %s, %s, %s, %s)
    """, (name, address, pay, number, contact_status))
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Data inserted successfully.")


# ===============================================================
# 5. MAIN PIPELINE
# ===============================================================
def handle_transcription(transcribed_text: str, number: str, contact_status: str):
    """
    End-to-end flow: parse → store
    """
    name, address, pay = parse_transcription(transcribed_text)
    print(f"Extracted fields:\n  Name: {name}\n  Address: {address}\n  Pay: {pay}")
    store_data(name, address, pay, number, contact_status)


# ===============================================================
# 6. TEST EXAMPLE
# ===============================================================
if __name__ == "__main__":
    init_db()

    # Simulated transcription text
    sample_text = "My name is Alice Brown. I live at 23 Palm Avenue, Chennai. My pay is 45000."

    # Inputs you might get externally or from a form
    phone_number = input("Enter contact number: ")
    contact_status = input("Enter contact status (Connected/Missed/Callback): ")

    handle_transcription(sample_text, phone_number, contact_status)
