from enum import Enum
import time

class IVRQuestion(Enum):
    NAME = "Please state your full name."
    LOCATION = "What area or city are you located in?"
    RATE = "How much do you expect to be paid per hour?"

class IVRHandler:
    def __init__(self):
        self.questions = [
            IVRQuestion.NAME,
            IVRQuestion.LOCATION,
            IVRQuestion.RATE
        ]
        self.pause_duration = 2  # seconds between questions

    def get_next_question(self, question_index: int) -> str:
        if 0 <= question_index < len(self.questions):
            time.sleep(self.pause_duration)
            return self.questions[question_index].value
        return None
