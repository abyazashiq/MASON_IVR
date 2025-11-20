import re

DIGIT_WORDS = {
    "zero":"0","oh":"0",
    "one":"1","two":"2","three":"3","four":"4","five":"5",
    "six":"6","seven":"7","eight":"8","nine":"9"
}

def words_to_digits(text: str) -> str:
    words = text.lower().split()
    converted = []
    for w in words:
        if w in DIGIT_WORDS:
            converted.append(DIGIT_WORDS[w])
        elif w.isdigit():
            converted.append(w)
    return "".join(converted)

def extract_contact_number(text: str):
    # convert spoken words first
    number_from_words = words_to_digits(text)

    # fallback: extract any 10–12 digit number from Whisper output
    match = re.search(r"\b\d{10,12}\b", number_from_words)
    return match.group(0) if match else None


def extract_name(text: str):
    patterns = [
        r"my name is ([A-Za-z ]+)",
        r"i am ([A-Za-z ]+)",
        r"this is ([A-Za-z ]+)"
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            # stop at next keyword
            name = m.group(1).strip()
            name = name.split("from")[0].strip()
            return name
    return None


def extract_place(text: str):
    patterns = [
        r"from ([A-Za-z ]+)",
        r"live in ([A-Za-z ]+)",
        r"based in ([A-Za-z ]+)"
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            place = m.group(1).strip()
            place = place.split("wage")[0].strip()
            return place
    return None


def extract_wage(text: str):
    # convert spoken numbers also
    converted = words_to_digits(text)
    
    match = re.search(r"\b(\d{2,5})\b", converted)  # 50–5000
    return int(match.group(1)) if match else None


def extract_contact_status(text: str):
    text = text.lower()
    if "don't call" in text or "do not call" in text:
        return "not reachable"
    if "call me back" in text or "please call" in text:
        return "reachable"
    return "unknown"


def extract_fields(text: str):
    return {
        "name": extract_name(text),
        "place": extract_place(text),
        "wages": extract_wage(text),
        "contact_number": extract_contact_number(text),
        "contact_status": extract_contact_status(text),
    }
