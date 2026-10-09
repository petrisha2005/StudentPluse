from app.schemas.auth import LoginRequest, RegisterRequest, Token, TokenData
from app.schemas.user import UserBase, UserCreate, UserResponse, UserWithProfile
from app.schemas.profile import ProfileBase, ProfileUpdate, ProfileResponse
from app.schemas.college import CollegeBase, CollegeCreate, CollegeResponse
from app.schemas.skill import SkillBase, SkillCreate, SkillResponse, UserSkillCreate, UserSkillResponse
from app.schemas.interest import InterestBase, InterestCreate, InterestResponse, UserInterestCreate, UserInterestResponse

__all__ = [
    "LoginRequest", "RegisterRequest", "Token", "TokenData",
    "UserBase", "UserCreate", "UserResponse", "UserWithProfile",
    "ProfileBase", "ProfileUpdate", "ProfileResponse",
    "CollegeBase", "CollegeCreate", "CollegeResponse",
    "SkillBase", "SkillCreate", "SkillResponse", "UserSkillCreate", "UserSkillResponse",
    "InterestBase", "InterestCreate", "InterestResponse", "UserInterestCreate", "UserInterestResponse",
]
