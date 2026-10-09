from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.interest import InterestResponse
from app.services.metadata_service import get_all_interests

router = APIRouter()

@router.get("", response_model=List[InterestResponse])
def list_interests(db: Session = Depends(get_db)):
    return get_all_interests(db)
