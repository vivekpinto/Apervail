from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

import models, schemas
from database import get_db

router = APIRouter(prefix="/resources", tags=["resources"])

@router.get("/", response_model=List[schemas.ResourceCardOut])
def get_resources(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.ResourceCard)
    if category:
        query = query.filter(models.ResourceCard.category == category)
    return query.all()

@router.post("/", response_model=schemas.ResourceCardOut)
def create_resource(resource: schemas.ResourceCardCreate, db: Session = Depends(get_db)):
    db_resource = models.ResourceCard(**resource.dict())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource