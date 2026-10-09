from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse
from app.schemas.user import UserWithProfile
from app.services.auth_service import register_new_user, login_user
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new student user account.
    """
    return register_new_user(db, req)

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT access token.
    """
    return login_user(db, req)

@router.get("/me", response_model=UserWithProfile)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get authenticated user profile details.
    """
    return current_user

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout route (stateless JWT client cleanup).
    """
    return {"message": "Successfully logged out"}
