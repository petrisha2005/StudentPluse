from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.skill import SkillResponse
from app.services.metadata_service import get_all_skills

router = APIRouter()

@router.get("", response_model=List[SkillResponse])
def list_skills(db: Session = Depends(get_db)):
    return get_all_skills(db)
