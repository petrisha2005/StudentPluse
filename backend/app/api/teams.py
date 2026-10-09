from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.team import TeamStatus
from app.schemas.team import (
    TeamCreate, TeamUpdate, TeamResponse,
    JoinRequestCreate, JoinRequestReview, JoinRequestResponse
)
from app.services.team_service import (
    create_team, get_team_by_id, list_teams, update_team, close_team,
    create_join_request, review_join_request, list_team_join_requests,
    list_user_teams, list_user_join_requests
)

router = APIRouter()


@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_new_team(
    team_in: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new team. Automatically assigns current_user as OWNER.
    """
    return create_team(db, current_user, team_in)


@router.get("", response_model=List[TeamResponse])
def discover_teams(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[TeamStatus] = Query(None, alias="status"),
    skill_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    List and filter teams for discovery.
    """
    return list_teams(
        db,
        skip=skip,
        limit=limit,
        status_filter=status_filter,
        skill_id=skill_id,
        search=search
    )


@router.get("/me", response_model=List[TeamResponse])
def get_my_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all teams owned by or joined by current user.
    """
    return list_user_teams(db, current_user)


@router.get("/me/join-requests", response_model=List[JoinRequestResponse])
def get_my_join_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all join requests submitted by current user.
    """
    return list_user_join_requests(db, current_user)


@router.get("/{team_id}", response_model=TeamResponse)
def get_team_details(
    team_id: int,
    db: Session = Depends(get_db)
):
    """
    Get team details by team ID.
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    return team


@router.patch("/{team_id}", response_model=TeamResponse)
def update_team_details(
    team_id: int,
    update_in: TeamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update team details (Owner only).
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if team.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team owner can edit team details"
        )

    return update_team(db, team, update_in)


@router.post("/{team_id}/close", response_model=TeamResponse)
def close_team_endpoint(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Close team to new members (Owner only).
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if team.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team owner can close the team"
        )

    return close_team(db, team)


@router.post("/{team_id}/join-requests", response_model=JoinRequestResponse, status_code=status.HTTP_201_CREATED)
def submit_join_request(
    team_id: int,
    req_in: JoinRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit a request to join a team.
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    return create_join_request(db, team, current_user, req_in)


@router.get("/{team_id}/join-requests", response_model=List[JoinRequestResponse])
def get_team_join_requests(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of join requests for a team (Owner only).
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if team.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team owner can view join requests"
        )

    return list_team_join_requests(db, team)


@router.patch("/{team_id}/join-requests/{request_id}", response_model=JoinRequestResponse)
def review_team_join_request(
    team_id: int,
    request_id: int,
    review_in: JoinRequestReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Accept or reject a join request (Owner only).
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if team.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team owner can review join requests"
        )

    return review_join_request(db, team, request_id, review_in)
