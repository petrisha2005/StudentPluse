import pytest
from sqlalchemy.exc import IntegrityError
from app.models.user import User, UserRole
from app.models.skill import Skill, ProficiencyLevel
from app.models.team import (
    Team, TeamStatus, TeamMember, TeamMemberRole,
    TeamRequirement, TeamJoinRequest, JoinRequestStatus
)


def test_create_team_with_owner_and_members(db_session):
    # Setup users
    owner = User(email="owner@example.com", password_hash="hash", full_name="Team Owner", role=UserRole.STUDENT)
    member = User(email="member@example.com", password_hash="hash", full_name="Team Member", role=UserRole.STUDENT)
    db_session.add_all([owner, member])
    db_session.commit()

    # Create team
    team = Team(
        name="AI Innovators",
        project_title="Neural Search Engine",
        description="Building scalable AI search.",
        owner_id=owner.id,
        max_members=4,
        status=TeamStatus.OPEN
    )
    db_session.add(team)
    db_session.commit()

    # Add owner and member to TeamMember
    tm_owner = TeamMember(team_id=team.id, user_id=owner.id, role=TeamMemberRole.OWNER)
    tm_member = TeamMember(team_id=team.id, user_id=member.id, role=TeamMemberRole.MEMBER)
    db_session.add_all([tm_owner, tm_member])
    db_session.commit()

    assert team.id is not None
    assert len(team.members) == 2
    assert team.owner.email == "owner@example.com"


def test_team_member_unique_constraint(db_session):
    user = User(email="unique_member@example.com", password_hash="hash", full_name="Unique Member", role=UserRole.STUDENT)
    db_session.add(user)
    db_session.commit()

    team = Team(name="Unique Team", project_title="Unique Title", owner_id=user.id)
    db_session.add(team)
    db_session.commit()

    tm1 = TeamMember(team_id=team.id, user_id=user.id, role=TeamMemberRole.OWNER)
    db_session.add(tm1)
    db_session.commit()

    # Attempt adding duplicate member for same team
    tm2 = TeamMember(team_id=team.id, user_id=user.id, role=TeamMemberRole.MEMBER)
    db_session.add(tm2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_team_requirement_skill_association(db_session):
    user = User(email="req_owner@example.com", password_hash="hash", full_name="Req Owner", role=UserRole.STUDENT)
    skill = Skill(name="Rust", category="Backend")
    db_session.add_all([user, skill])
    db_session.commit()

    team = Team(name="Rustaceans", project_title="Systems Programming", owner_id=user.id)
    db_session.add(team)
    db_session.commit()

    req = TeamRequirement(team_id=team.id, skill_id=skill.id, required_proficiency=ProficiencyLevel.ADVANCED)
    db_session.add(req)
    db_session.commit()

    assert len(team.requirements) == 1
    assert team.requirements[0].skill.name == "Rust"
    assert team.requirements[0].required_proficiency == ProficiencyLevel.ADVANCED


def test_team_join_request_unique_constraint(db_session):
    owner = User(email="jq_owner@example.com", password_hash="hash", full_name="JQ Owner", role=UserRole.STUDENT)
    applicant = User(email="applicant@example.com", password_hash="hash", full_name="Applicant", role=UserRole.STUDENT)
    db_session.add_all([owner, applicant])
    db_session.commit()

    team = Team(name="Join Team", project_title="Join Project", owner_id=owner.id)
    db_session.add(team)
    db_session.commit()

    jr1 = TeamJoinRequest(team_id=team.id, user_id=applicant.id, message="Interested in backend", status=JoinRequestStatus.PENDING)
    db_session.add(jr1)
    db_session.commit()

    # Duplicate request for same team and user should fail unique constraint
    jr2 = TeamJoinRequest(team_id=team.id, user_id=applicant.id, message="Second request", status=JoinRequestStatus.PENDING)
    db_session.add(jr2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_team_cascade_delete(db_session):
    owner = User(email="cascade_owner@example.com", password_hash="hash", full_name="Cascade Owner", role=UserRole.STUDENT)
    applicant = User(email="cascade_applicant@example.com", password_hash="hash", full_name="Cascade Applicant", role=UserRole.STUDENT)
    skill = Skill(name="Go", category="Backend")
    db_session.add_all([owner, applicant, skill])
    db_session.commit()

    team = Team(name="Cascade Team", project_title="Cascade Title", owner_id=owner.id)
    db_session.add(team)
    db_session.commit()

    db_session.add(TeamMember(team_id=team.id, user_id=owner.id, role=TeamMemberRole.OWNER))
    db_session.add(TeamRequirement(team_id=team.id, skill_id=skill.id, required_proficiency=ProficiencyLevel.EXPERT))
    db_session.add(TeamJoinRequest(team_id=team.id, user_id=applicant.id, status=JoinRequestStatus.PENDING))
    db_session.commit()

    # Delete team
    db_session.delete(team)
    db_session.commit()

    assert db_session.query(TeamMember).filter(TeamMember.team_id == team.id).count() == 0
    assert db_session.query(TeamRequirement).filter(TeamRequirement.team_id == team.id).count() == 0
    assert db_session.query(TeamJoinRequest).filter(TeamJoinRequest.team_id == team.id).count() == 0
