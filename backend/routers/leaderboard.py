from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import desc

import models, schemas
from database import get_db

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/", response_model=List[schemas.ScoreOut])
def get_leaderboard(db: Session = Depends(get_db)):
    scores = db.query(models.Score).order_by(desc(models.Score.score_percent)).limit(10).all()
    return scores