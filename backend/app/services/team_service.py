from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.team import (
    Team, TeamStatus, TeamMember, TeamMemberRole,
    TeamRequirement, TeamJoinRequest, JoinRequestStatus
)
from app.models.user import User
from app.models.skill import Skill
from app.schemas.team import (
    TeamCreate, TeamUpdate, JoinRequestCreate, JoinRequestReview
)


from app.models.profile import Profile


def _get_team_eager_query(db: Session):
    return db.query(Team).options(
        joinedload(Team.owner).joinedload(User.profile).joinedload(Profile.college),
        joinedload(Team.members).joinedload(TeamMember.user).joinedload(User.profile).joinedload(Profile.college),
        joinedload(Team.requirements).joinedload(TeamRequirement.skill)
    )



def create_team(db: Session, owner: User, team_in: TeamCreate) -> Team:
    # Validate required skill IDs
    if team_in.required_skills:
        skill_ids = [req.skill_id for req in team_in.required_skills]
        existing_skills = db.query(Skill.id).filter(Skill.id.in_(skill_ids)).all()
        existing_skill_ids = {s.id for s in existing_skills}
        for s_id in skill_ids:
            if s_id not in existing_skill_ids:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Skill with ID {s_id} does not exist"
                )

    team = Team(
        name=team_in.name.strip(),
        project_title=team_in.project_title.strip(),
        description=team_in.description.strip() if team_in.description else None,
        owner_id=owner.id,
        max_members=team_in.max_members,
        status=TeamStatus.OPEN
    )
    db.add(team)
    db.commit()
    db.refresh(team)

    # Automatically add owner as OWNER member
    owner_member = TeamMember(
        team_id=team.id,
        user_id=owner.id,
        role=TeamMemberRole.OWNER
    )
    db.add(owner_member)

    # Add team requirements
    if team_in.required_skills:
        seen_skill_ids = set()
        for req in team_in.required_skills:
            if req.skill_id not in seen_skill_ids:
                seen_skill_ids.add(req.skill_id)
                db_req = TeamRequirement(
                    team_id=team.id,
                    skill_id=req.skill_id,
                    required_proficiency=req.required_proficiency
                )
                db.add(db_req)

    db.commit()
    return get_team_by_id(db, team.id)


def get_team_by_id(db: Session, team_id: int) -> Optional[Team]:
    return _get_team_eager_query(db).filter(Team.id == team_id).first()


def list_teams(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[TeamStatus] = None,
    skill_id: Optional[int] = None,
    search: Optional[str] = None
) -> List[Team]:
    query = _get_team_eager_query(db)

    if status_filter:
        query = query.filter(Team.status == status_filter)

    if skill_id:
        query = query.filter(Team.requirements.any(TeamRequirement.skill_id == skill_id))

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Team.name.ilike(search_pattern)) |
            (Team.project_title.ilike(search_pattern)) |
            (Team.description.ilike(search_pattern))
        )

    return query.order_by(Team.created_at.desc()).offset(skip).limit(limit).all()


def update_team(db: Session, team: Team, update_in: TeamUpdate) -> Team:
    if update_in.name is not None:
        team.name = update_in.name.strip()

    if update_in.project_title is not None:
        team.project_title = update_in.project_title.strip()

    if update_in.description is not None:
        team.description = update_in.description.strip() if update_in.description else None

    current_member_count = db.query(TeamMember).filter(TeamMember.team_id == team.id).count()

    if update_in.max_members is not None:
        if update_in.max_members < current_member_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"max_members cannot be less than current member count ({current_member_count})"
            )
        team.max_members = update_in.max_members

    if update_in.status is not None:
        if update_in.status == TeamStatus.OPEN and current_member_count >= team.max_members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot open team because it is already at full capacity"
            )
        team.status = update_in.status

    if update_in.required_skills is not None:
        # Validate skills
        skill_ids = [req.skill_id for req in update_in.required_skills]
        if skill_ids:
            existing_skills = db.query(Skill.id).filter(Skill.id.in_(skill_ids)).all()
            existing_skill_ids = {s.id for s in existing_skills}
            for s_id in skill_ids:
                if s_id not in existing_skill_ids:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Skill with ID {s_id} does not exist"
                    )

        # Replace existing requirements
        db.query(TeamRequirement).filter(TeamRequirement.team_id == team.id).delete()
        seen_skill_ids = set()
        for req in update_in.required_skills:
            if req.skill_id not in seen_skill_ids:
                seen_skill_ids.add(req.skill_id)
                db_req = TeamRequirement(
                    team_id=team.id,
                    skill_id=req.skill_id,
                    required_proficiency=req.required_proficiency
                )
                db.add(db_req)

    team.updated_at = datetime.now(timezone.utc)
    db.commit()
    return get_team_by_id(db, team.id)


def close_team(db: Session, team: Team) -> Team:
    team.status = TeamStatus.CLOSED
    team.updated_at = datetime.now(timezone.utc)
    db.commit()
    return get_team_by_id(db, team.id)


def create_join_request(db: Session, team: Team, user: User, req_in: JoinRequestCreate) -> TeamJoinRequest:
    if user.id == team.owner_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner cannot request to join their own team"
        )

    # Check if user is already a member
    is_member = db.query(TeamMember).filter(
        TeamMember.team_id == team.id,
        TeamMember.user_id == user.id
    ).first()
    if is_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a member of this team"
        )

    if team.status == TeamStatus.CLOSED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This team is closed to new join requests"
        )

    current_member_count = db.query(TeamMember).filter(TeamMember.team_id == team.id).count()
    if current_member_count >= team.max_members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This team is at full capacity"
        )

    # Check existing join request
    existing_request = db.query(TeamJoinRequest).filter(
        TeamJoinRequest.team_id == team.id,
        TeamJoinRequest.user_id == user.id
    ).first()

    if existing_request:
        if existing_request.status == JoinRequestStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You already have a pending join request for this team"
            )
        elif existing_request.status == JoinRequestStatus.ACCEPTED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are already an accepted member of this team"
            )
        elif existing_request.status == JoinRequestStatus.REJECTED:
            # Resubmit rejected request by reusing existing row to satisfy UniqueConstraint
            existing_request.status = JoinRequestStatus.PENDING
            existing_request.message = req_in.message.strip() if req_in.message else None
            existing_request.updated_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(existing_request)
            return existing_request

    # Create new join request
    join_req = TeamJoinRequest(
        team_id=team.id,
        user_id=user.id,
        message=req_in.message.strip() if req_in.message else None,
        status=JoinRequestStatus.PENDING
    )
    db.add(join_req)
    db.commit()
    db.refresh(join_req)
    return join_req


def review_join_request(db: Session, team: Team, request_id: int, review_in: JoinRequestReview) -> TeamJoinRequest:
    join_req = db.query(TeamJoinRequest).options(
        joinedload(TeamJoinRequest.user)
    ).filter(
        TeamJoinRequest.id == request_id,
        TeamJoinRequest.team_id == team.id
    ).first()

    if not join_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Join request not found"
        )

    if join_req.status != JoinRequestStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Join request has already been processed ({join_req.status})"
        )

    if review_in.status == JoinRequestStatus.REJECTED:
        join_req.status = JoinRequestStatus.REJECTED
        join_req.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(join_req)
        return join_req

    if review_in.status == JoinRequestStatus.ACCEPTED:
        # Strict capacity check re-verified within transaction
        current_member_count = db.query(TeamMember).filter(TeamMember.team_id == team.id).count()
        if current_member_count >= team.max_members:
            team.status = TeamStatus.CLOSED
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot accept request because the team is at full capacity"
            )

        # Check duplicate member before adding
        existing_member = db.query(TeamMember).filter(
            TeamMember.team_id == team.id,
            TeamMember.user_id == join_req.user_id
        ).first()

        if not existing_member:
            new_member = TeamMember(
                team_id=team.id,
                user_id=join_req.user_id,
                role=TeamMemberRole.MEMBER
            )
            db.add(new_member)

        join_req.status = JoinRequestStatus.ACCEPTED
        join_req.updated_at = datetime.now(timezone.utc)

        # Close team automatically if full capacity is reached
        new_member_count = current_member_count + 1
        if new_member_count >= team.max_members:
            team.status = TeamStatus.CLOSED

        db.commit()
        db.refresh(join_req)
        return join_req


def list_team_join_requests(db: Session, team: Team) -> List[TeamJoinRequest]:
    return db.query(TeamJoinRequest).options(
        joinedload(TeamJoinRequest.user).joinedload(User.profile).joinedload(Profile.college)
    ).filter(
        TeamJoinRequest.team_id == team.id
    ).order_by(TeamJoinRequest.created_at.desc()).all()


def list_user_teams(db: Session, user: User) -> List[Team]:
    # Teams where user is owner or member
    user_team_ids = db.query(TeamMember.team_id).filter(TeamMember.user_id == user.id).all()
    team_ids = {t.team_id for t in user_team_ids}

    if not team_ids:
        return []

    return _get_team_eager_query(db).filter(
        Team.id.in_(list(team_ids))
    ).order_by(Team.created_at.desc()).all()


def list_user_join_requests(db: Session, user: User) -> List[TeamJoinRequest]:
    return db.query(TeamJoinRequest).options(
        joinedload(TeamJoinRequest.user).joinedload(User.profile).joinedload(Profile.college),
        joinedload(TeamJoinRequest.team).joinedload(Team.owner).joinedload(User.profile).joinedload(Profile.college)
    ).filter(
        TeamJoinRequest.user_id == user.id
    ).order_by(TeamJoinRequest.created_at.desc()).all()
