from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CollegeBase(BaseModel):
    name: str
    city: Optional[str] = None
    state: Optional[str] = None
    website: Optional[str] = None

class CollegeCreate(CollegeBase):
    pass

class CollegeResponse(CollegeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
