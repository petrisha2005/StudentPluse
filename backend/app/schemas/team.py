from pydantic import BaseModel, Field, ConfigDict, computed_field, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.team import TeamStatus, JoinRequestStatus, TeamMemberRole
from app.models.skill import ProficiencyLevel
from app.schemas.user import UserResponse, UserPublicResponse
from app.schemas.skill import SkillResponse


class TeamRequirementCreate(BaseModel):
    skill_id: int
    required_proficiency: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE


class TeamRequirementResponse(BaseModel):
    id: int
    team_id: int
    skill_id: int
    skill: SkillResponse
    required_proficiency: ProficiencyLevel

    model_config = ConfigDict(from_attributes=True)


class TeamMemberResponse(BaseModel):
    id: int
    team_id: int
    user_id: int
    user: UserPublicResponse
    role: TeamMemberRole
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)



class TeamCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, description="Team name")
    project_title: str = Field(..., min_length=2, max_length=255, description="Project title or idea")
    description: Optional[str] = Field(None, max_length=2000, description="Project description")
    max_members: int = Field(4, ge=2, le=50, description="Maximum number of team members including owner")
    required_skills: Optional[List[TeamRequirementCreate]] = Field(default_factory=list)


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    project_title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    max_members: Optional[int] = Field(None, ge=2, le=50)
    status: Optional[TeamStatus] = None
    required_skills: Optional[List[TeamRequirementCreate]] = None


class JoinRequestCreate(BaseModel):
    message: Optional[str] = Field(None, max_length=1000, description="Application note to the team owner")


class JoinRequestReview(BaseModel):
    status: JoinRequestStatus

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: JoinRequestStatus) -> JoinRequestStatus:
        if v == JoinRequestStatus.PENDING:
            raise ValueError("Review status must be either 'accepted' or 'rejected'")
        return v


class JoinRequestResponse(BaseModel):
    id: int
    team_id: int
    user_id: int
    user: UserPublicResponse
    message: Optional[str] = None
    status: JoinRequestStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TeamResponse(BaseModel):
    id: int
    name: str
    project_title: str
    description: Optional[str] = None
    owner_id: int
    owner: UserPublicResponse
    max_members: int
    status: TeamStatus
    created_at: datetime
    updated_at: datetime
    members: List[TeamMemberResponse] = []
    requirements: List[TeamRequirementResponse] = []

    model_config = ConfigDict(from_attributes=True)


    @computed_field
    @property
    def current_member_count(self) -> int:
        return len(self.members) if self.members else 0

    @computed_field
    @property
    def available_capacity(self) -> int:
        count = len(self.members) if self.members else 0
        return max(0, self.max_members - count)
