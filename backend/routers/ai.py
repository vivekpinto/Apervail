from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import traceback;

import models, schemas
from database import get_db
from gemini_client import generate_quiz, generate_feedback
import json

router = APIRouter(prefix="/ai", tags=["ai"])

class QuizGenerationRequest(BaseModel):
    topic: str
    num_questions: int = 5

@router.post("/generate-quiz", response_model=schemas.QuizOut)
def create_quiz_from_ai(request: QuizGenerationRequest, db: Session = Depends(get_db)):
    try:
        quiz_data = generate_quiz(request.topic, request.num_questions)
    except Exception as e:
        traceback.print_exc()   
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
        

    # Create Quiz
    db_quiz = models.Quiz(
        title=quiz_data["title"],
        description=quiz_data.get("description", "")
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    # Create Questions
    for q in quiz_data["questions"]:
        # Convert options list to JSON string for storage
        options_json = json.dumps(q["options"])
        db_question = models.Question(
            quiz_id=db_quiz.id,
            question_text=q["question_text"],
            options=options_json,
            correct_answer=q["correct_answer"],
            explanation=q.get("explanation", "")
        )
        db.add(db_question)
    db.commit()

    return db_quiz