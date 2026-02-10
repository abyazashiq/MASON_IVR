from database import insert_record 

def insert_record_handler(l):
    insert_record(name=l.get("name",None), number=l.get("number",None), address=l.get("address",None), pay=l.get("pay",None),age= l.get("age",None), contact_status=l.get("contact_status","Pending"), transcription=l.get("name",None)+"," +l.get("number",None)+","+ l.get("address",None)+","+ l.get("pay",None)+","+ l.get("age",None))

