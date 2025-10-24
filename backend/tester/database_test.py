from database import insert_call

# Insert a call
insert_call(
    name="Alice Smith",
    number="8888888888",
    address="789 Lane",
    pay=1200,
    contact_status="Pending",
    transcription="Customer asked about subscription"
)
# Note: This test only inserts data and does not retrieve it, adhering to write-only policy.