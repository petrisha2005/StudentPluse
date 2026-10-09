from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.user import User, UserRole
from app.models.profile import Profile
from app.core.security import get_password_hash
from app.schemas.auth import RegisterRequest

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.lower().strip()).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).options(
        joinedload(User.profile).joinedload(Profile.college),
        joinedload(User.skills),
        joinedload(User.interests)
    ).filter(User.id == user_id).first()

def create_user(db: Session, req: RegisterRequest) -> User:
    hashed_pwd = get_password_hash(req.password)
    user = User(
        email=req.email.lower().strip(),
        password_hash=hashed_pwd,
        full_name=req.full_name.strip(),
        role=UserRole.STUDENT,
        is_active=True,
        is_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize empty profile for the user
    profile = Profile(user_id=user.id)
    db.add(profile)
    db.commit()
    db.refresh(user)
    
    return user

def list_users(db: Session, skip: int = 0, limit: int = 20) -> List[User]:
    return db.query(User).options(
        joinedload(User.profile).joinedload(Profile.college),
        joinedload(User.skills),
        joinedload(User.interests)
    ).filter(User.is_active == True).offset(skip).limit(limit).all()
