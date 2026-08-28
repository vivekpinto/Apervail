import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from gemini_client import generate_feedback
import models, schemas
from database import get_db

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.get("/", response_model=List[schemas.QuizOut])
def list_quizzes(db: Session = Depends(get_db)):
    return db.query(models.Quiz).all()

@router.get("/{quiz_id}/questions/", response_model=List[schemas.QuestionOut])
def get_questions(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz.questions

@router.post("/{quiz_id}/submit/", response_model=schemas.ScoreOut)
def submit_quiz(quiz_id: int, submission: schemas.QuizSubmission, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.query(models.Question).filter(models.Question.quiz_id == quiz_id).all()
    if len(questions) == 0:
        raise HTTPException(status_code=400, detail="Quiz has no questions")

    question_map = {q.id: q for q in questions}
    correct_count = 0
    weak_areas = []  # List of question texts where user answered incorrectly

    for ans in submission.answers:
        question = question_map.get(ans.question_id)
        if question:
            if question.correct_answer == ans.selected_answer:
                correct_count += 1
            else:
                weak_areas.append(question.question_text)

    total = len(questions)
    score_percent = (correct_count / total) * 100

    # Generate AI feedback
    try:
        feedback = generate_feedback(score_percent, quiz.title, weak_areas)
    except:
        feedback = None

    db_score = models.Score(
        user_id=submission.user_id,
        quiz_id=quiz_id,
        score_percent=score_percent,
        time_taken=0,
        feedback=feedback
    )
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score