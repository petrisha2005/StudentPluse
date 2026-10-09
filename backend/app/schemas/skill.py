from pydantic import BaseModel
from typing import Optional
from app.models.skill import ProficiencyLevel

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True

class UserSkillCreate(BaseModel):
    skill_id: int
    proficiency: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE

class UserSkillResponse(BaseModel):
    id: int
    skill_id: int
    skill: SkillResponse
    proficiency: ProficiencyLevel

    class Config:
        from_attributes = True
