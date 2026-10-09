from pydantic import BaseModel
from typing import Optional

class InterestBase(BaseModel):
    name: str
    category: Optional[str] = None

class InterestCreate(InterestBase):
    pass

class InterestResponse(InterestBase):
    id: int

    class Config:
        from_attributes = True

class UserInterestCreate(BaseModel):
    interest_id: int

class UserInterestResponse(BaseModel):
    id: int
    interest_id: int
    interest: InterestResponse

    class Config:
        from_attributes = True
