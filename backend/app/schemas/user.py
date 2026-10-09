from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.user import UserRole
from app.schemas.profile import ProfileResponse
from app.schemas.skill import UserSkillResponse
from app.schemas.interest import UserInterestResponse

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserPublicResponse(BaseModel):
    id: int
    full_name: str
    role: UserRole = UserRole.STUDENT
    profile: Optional[ProfileResponse] = None

    model_config = ConfigDict(from_attributes=True)

class UserWithProfile(UserResponse):
    profile: Optional[ProfileResponse] = None
    skills: List[UserSkillResponse] = []
    interests: List[UserInterestResponse] = []

    model_config = ConfigDict(from_attributes=True)
