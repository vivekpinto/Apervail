from pydantic import BaseModel
from typing import List, Optional

# --- Resource Card Schemas ---
class ResourceCardBase(BaseModel):
    title: str
    summary: str
    url: str
    category: str
    tags: str | None = None

class ResourceCardCreate(ResourceCardBase):
    pass

class ResourceCardOut(ResourceCardBase):
    id: int

    class Config:
        from_attributes = True

# --- User ---
class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True

# --- Quiz ---
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None

class QuizCreate(QuizBase):
    pass

class QuizOut(QuizBase):
    id: int

    class Config:
        from_attributes = True

# --- Question ---
class QuestionBase(BaseModel):
    question_text: str
    correct_answer: str
    options: str  # JSON string
    explanation: Optional[str] = None

class QuestionOut(QuestionBase):
    id: int
    quiz_id: int

    class Config:
        from_attributes = True

# --- Score ---
class ScoreBase(BaseModel):
    user_id: int
    quiz_id: int
    score_percent: float
    time_taken: Optional[int] = None
    feedback: Optional[str] = None

class ScoreCreate(ScoreBase):
    pass

class ScoreOut(ScoreBase):
    id: int

    class Config:
        from_attributes = True

# --- Submission (for quiz submission) ---
class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str

class QuizSubmission(BaseModel):
    user_id: int
    answers: List[AnswerSubmit]