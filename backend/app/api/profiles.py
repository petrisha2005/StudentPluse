from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserWithProfile
from app.schemas.profile import ProfileUpdate
from app.services.profile_service import update_user_profile
from app.services.user_service import get_user_by_id

router = APIRouter()

@router.get("/me", response_model=UserWithProfile)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserWithProfile)
def update_my_profile(
    update_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_user = update_user_profile(db, current_user, update_data)
    return get_user_by_id(db, updated_user.id)

@router.get("/{user_id}", response_model=UserWithProfile)
def get_user_profile_by_id(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
