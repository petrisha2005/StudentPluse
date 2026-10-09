import pytest
from app.core.security import create_access_token
from app.models.user import User, UserRole
from app.models.skill import Skill, ProficiencyLevel
from app.models.team import Team, TeamStatus, TeamMember, TeamMemberRole, TeamJoinRequest, JoinRequestStatus


@pytest.fixture
def test_users(db_session):
    u1 = User(email="owner_api@example.com", password_hash="hash", full_name="Team Owner", role=UserRole.STUDENT)
    u2 = User(email="student1_api@example.com", password_hash="hash", full_name="Student One", role=UserRole.STUDENT)
    u3 = User(email="student2_api@example.com", password_hash="hash", full_name="Student Two", role=UserRole.STUDENT)
    u4 = User(email="student3_api@example.com", password_hash="hash", full_name="Student Three", role=UserRole.STUDENT)
    db_session.add_all([u1, u2, u3, u4])
    db_session.commit()
    return {"owner": u1, "student1": u2, "student2": u3, "student3": u4}


@pytest.fixture
def auth_headers(test_users):
    return {
        "owner": {"Authorization": f"Bearer {create_access_token(test_users['owner'].id)}"},
        "student1": {"Authorization": f"Bearer {create_access_token(test_users['student1'].id)}"},
        "student2": {"Authorization": f"Bearer {create_access_token(test_users['student2'].id)}"},
        "student3": {"Authorization": f"Bearer {create_access_token(test_users['student3'].id)}"},
    }


def test_create_team_success(client, auth_headers):
    # Get a skill from seeded DB
    skills_res = client.get("/api/skills")
    assert skills_res.status_code == 200
    skills = skills_res.json()
    assert len(skills) > 0
    skill_id = skills[0]["id"]

    payload = {
        "name": "Hackathon Alpha",
        "project_title": "AI Healthcare Assistant",
        "description": "Building an AI triage tool for emergency rooms.",
        "max_members": 3,
        "required_skills": [
            {"skill_id": skill_id, "required_proficiency": "advanced"}
        ]
    }

    response = client.post("/api/teams", json=payload, headers=auth_headers["owner"])
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Hackathon Alpha"
    assert data["project_title"] == "AI Healthcare Assistant"
    assert data["max_members"] == 3
    assert data["status"] == "open"
    assert data["current_member_count"] == 1
    assert data["available_capacity"] == 2
    assert len(data["members"]) == 1
    assert data["members"][0]["role"] == "owner"
    assert len(data["requirements"]) == 1
    assert data["requirements"][0]["skill_id"] == skill_id


def test_create_team_invalid_skill_fails(client, auth_headers):
    payload = {
        "name": "Invalid Skill Team",
        "project_title": "Bad Skill Test",
        "max_members": 4,
        "required_skills": [{"skill_id": 99999, "required_proficiency": "intermediate"}]
    }
    response = client.post("/api/teams", json=payload, headers=auth_headers["owner"])
    assert response.status_code == 400
    assert "Skill with ID 99999 does not exist" in response.json()["detail"]


def test_discover_and_get_team_details(client, auth_headers):
    # Create a team
    payload = {
        "name": "Discovery Team",
        "project_title": "Discovery Project",
        "max_members": 4
    }
    create_res = client.post("/api/teams", json=payload, headers=auth_headers["owner"])
    team_id = create_res.json()["id"]

    # Discover teams
    list_res = client.get("/api/teams?status=open&search=Discovery")
    assert list_res.status_code == 200
    teams = list_res.json()
    assert any(t["id"] == team_id for t in teams)

    # Get team details
    detail_res = client.get(f"/api/teams/{team_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["name"] == "Discovery Team"
    assert detail["owner"]["full_name"] == "Team Owner"



def test_update_and_close_team_permissions(client, auth_headers):
    # Create team by owner
    create_res = client.post("/api/teams", json={"name": "Perm Team", "project_title": "Title", "max_members": 4}, headers=auth_headers["owner"])
    team_id = create_res.json()["id"]

    # Non-owner update should fail
    update_res = client.patch(f"/api/teams/{team_id}", json={"name": "Hacked Name"}, headers=auth_headers["student1"])
    assert update_res.status_code == 403

    # Owner update succeeds
    update_res = client.patch(f"/api/teams/{team_id}", json={"name": "Updated Perm Team"}, headers=auth_headers["owner"])
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Updated Perm Team"

    # Non-owner close fails
    close_res = client.post(f"/api/teams/{team_id}/close", headers=auth_headers["student1"])
    assert close_res.status_code == 403

    # Owner close succeeds
    close_res = client.post(f"/api/teams/{team_id}/close", headers=auth_headers["owner"])
    assert close_res.status_code == 200
    assert close_res.json()["status"] == "closed"


def test_join_request_flow_and_review(client, auth_headers):
    # Create team with max capacity 2
    create_res = client.post("/api/teams", json={"name": "Join Flow Team", "project_title": "Title", "max_members": 2}, headers=auth_headers["owner"])
    team_id = create_res.json()["id"]

    # Owner cannot join own team
    owner_join_res = client.post(f"/api/teams/{team_id}/join-requests", json={"message": "Owner join"}, headers=auth_headers["owner"])
    assert owner_join_res.status_code == 400

    # Student 1 submits join request
    join_res1 = client.post(f"/api/teams/{team_id}/join-requests", json={"message": "Frontend developer here"}, headers=auth_headers["student1"])
    assert join_res1.status_code == 201
    req1_id = join_res1.json()["id"]

    # Duplicate pending request fails
    dup_res = client.post(f"/api/teams/{team_id}/join-requests", json={"message": "Second try"}, headers=auth_headers["student1"])
    assert dup_res.status_code == 400

    # Non-owner listing join requests fails
    list_req_nonowner = client.get(f"/api/teams/{team_id}/join-requests", headers=auth_headers["student1"])
    assert list_req_nonowner.status_code == 403

    # Owner lists join requests
    list_req_owner = client.get(f"/api/teams/{team_id}/join-requests", headers=auth_headers["owner"])
    assert list_req_owner.status_code == 200
    requests = list_req_owner.json()
    assert len(requests) == 1
    assert requests[0]["user"]["full_name"] == "Student One"


    # Owner accepts Student 1
    accept_res = client.patch(f"/api/teams/{team_id}/join-requests/{req1_id}", json={"status": "accepted"}, headers=auth_headers["owner"])
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "accepted"

    # Verify team is now FULL and CLOSED (owner=1 + student1=1 = 2 max_members)
    team_detail = client.get(f"/api/teams/{team_id}").json()
    assert team_detail["current_member_count"] == 2
    assert team_detail["available_capacity"] == 0
    assert team_detail["status"] == "closed"

    # Student 2 attempting to join full/closed team fails
    join_res2 = client.post(f"/api/teams/{team_id}/join-requests", json={"message": "Late request"}, headers=auth_headers["student2"])
    assert join_res2.status_code == 400


def test_reapplication_after_rejection(client, auth_headers):
    # Create team
    create_res = client.post("/api/teams", json={"name": "Rejection Team", "project_title": "Title", "max_members": 4}, headers=auth_headers["owner"])
    team_id = create_res.json()["id"]

    # Student 1 applies
    join_res = client.post(f"/api/teams/{team_id}/join-requests", json={"message": "First application"}, headers=auth_headers["student1"])
    req_id = join_res.json()["id"]

    # Owner rejects Student 1
    reject_res = client.patch(f"/api/teams/{team_id}/join-requests/{req_id}", json={"status": "rejected"}, headers=auth_headers["owner"])
    assert reject_res.status_code == 200
    assert reject_res.json()["status"] == "rejected"

    # Student 1 re-applies
    reapply_res = client.post(f"/api/teams/{team_id}/join-requests", json={"message": "Improved application"}, headers=auth_headers["student1"])
    assert reapply_res.status_code == 201
    assert reapply_res.json()["status"] == "pending"
    assert reapply_res.json()["message"] == "Improved application"


def test_user_teams_and_join_requests_dashboards(client, auth_headers):
    # Create team
    create_res = client.post("/api/teams", json={"name": "Dashboard Team", "project_title": "Title"}, headers=auth_headers["owner"])
    team_id = create_res.json()["id"]

    # Student 1 applies
    client.post(f"/api/teams/{team_id}/join-requests", json={"message": "Hi"}, headers=auth_headers["student1"])

    # Owner checks my teams
    my_teams_owner = client.get("/api/teams/me", headers=auth_headers["owner"])
    assert my_teams_owner.status_code == 200
    assert any(t["id"] == team_id for t in my_teams_owner.json())

    # Student 1 checks my join requests
    my_requests_student = client.get("/api/teams/me/join-requests", headers=auth_headers["student1"])
    assert my_requests_student.status_code == 200
    assert len(my_requests_student.json()) == 1
    assert my_requests_student.json()[0]["team_id"] == team_id
