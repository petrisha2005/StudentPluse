from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.college import CollegeResponse
from app.services.metadata_service import get_all_colleges

router = APIRouter()

@router.get("", response_model=List[CollegeResponse])
def list_colleges(db: Session = Depends(get_db)):
    return get_all_colleges(db)
