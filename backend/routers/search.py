from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

import models
from database import get_db

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/")
def search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    # Search resources
    resources = db.query(models.ResourceCard).filter(
        or_(
            models.ResourceCard.title.ilike(f"%{q}%"),
            models.ResourceCard.summary.ilike(f"%{q}%"),
            models.ResourceCard.tags.ilike(f"%{q}%")
        )
    ).limit(5).all()

    # Search quizzes
    quizzes = db.query(models.Quiz).filter(
        or_(
            models.Quiz.title.ilike(f"%{q}%"),
            models.Quiz.description.ilike(f"%{q}%")
        )
    ).limit(5).all()

    results = []
    for r in resources:
        link = f"/{r.category.lower().replace('_', '-')}"
        results.append({
            "id": r.id,
            "type": "resource",
            "title": r.title,
            "description": r.summary,
            "link": r.url
        })
    for quiz in quizzes:
        results.append({
            "id": quiz.id,
            "type": "quiz",
            "title": quiz.title,
            "description": quiz.description,
            "link": f"/quiz?quiz_id={quiz.id}"
        })

    return results