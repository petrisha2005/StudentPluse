from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
