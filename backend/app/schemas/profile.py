from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime
from app.schemas.college import CollegeResponse

class ProfileBase(BaseModel):
    college_id: Optional[int] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    college_id: Optional[int] = None
    college_name: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    skill_ids: Optional[List[int]] = None
    interest_ids: Optional[List[int]] = None

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    college: Optional[CollegeResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
