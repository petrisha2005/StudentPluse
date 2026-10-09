from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.profile import Profile
from app.models.user import User
from app.models.college import College
from app.models.skill import UserSkill, Skill, ProficiencyLevel
from app.models.interest import UserInterest, Interest
from app.schemas.profile import ProfileUpdate

def get_or_create_profile(db: Session, user_id: int) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        profile = Profile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

def update_user_profile(db: Session, user: User, update_data: ProfileUpdate) -> User:
    # Update User full_name if provided
    if update_data.full_name is not None:
        user.full_name = update_data.full_name.strip()
    
    profile = get_or_create_profile(db, user.id)

    # Handle college creation/linking if college_name is provided
    if update_data.college_name:
        college_name_clean = update_data.college_name.strip()
        college = db.query(College).filter(College.name.ilike(college_name_clean)).first()
        if not college:
            college = College(name=college_name_clean)
            db.add(college)
            db.commit()
            db.refresh(college)
        profile.college_id = college.id
    elif update_data.college_id is not None:
        profile.college_id = update_data.college_id

    # Update other profile attributes
    fields = ["degree", "branch", "year", "city", "bio", "profile_image", "github_url", "linkedin_url", "portfolio_url"]
    for field in fields:
        val = getattr(update_data, field)
        if val is not None:
            setattr(profile, field, val)

    # Update Skills if provided
    if update_data.skill_ids is not None:
        # Clear existing skills
        db.query(UserSkill).filter(UserSkill.user_id == user.id).delete()
        for s_id in update_data.skill_ids:
            skill = db.query(Skill).filter(Skill.id == s_id).first()
            if skill:
                us = UserSkill(user_id=user.id, skill_id=s_id, proficiency=ProficiencyLevel.INTERMEDIATE)
                db.add(us)

    # Update Interests if provided
    if update_data.interest_ids is not None:
        # Clear existing interests
        db.query(UserInterest).filter(UserInterest.user_id == user.id).delete()
        for i_id in update_data.interest_ids:
            interest = db.query(Interest).filter(Interest.id == i_id).first()
            if interest:
                ui = UserInterest(user_id=user.id, interest_id=i_id)
                db.add(ui)

    db.commit()
    db.refresh(user)
    return user
