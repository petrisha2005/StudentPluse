from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserWithProfile
from app.services.user_service import list_users

router = APIRouter()

@router.get("", response_model=List[UserWithProfile])
def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List student users for discovery.
    """
    return list_users(db, skip=skip, limit=limit)
