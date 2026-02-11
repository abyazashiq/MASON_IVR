"""Data handler for IVR session results."""

from database import insert_record


def insert_record_handler(fields: dict):
    """Insert collected IVR fields into database."""
    insert_record(
        name=fields.get("name"),
        number=fields.get("number"),
        address=fields.get("address"),
        pay=fields.get("pay"),
        age=fields.get("age"),
        contact_status=fields.get("contact_status", "Pending"),
        transcription=",".join([
            str(fields.get("name", "")).strip(),
            str(fields.get("number", "")).strip(),
            str(fields.get("address", "")).strip(),
            str(fields.get("pay", "")).strip(),
            str(fields.get("age", "")).strip()
        ])
    )

