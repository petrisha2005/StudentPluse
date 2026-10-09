import pytest
from app.models.user import User

def test_register_user_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Jordan Lee",
            "email": "jordan.lee@mit.edu",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "jordan.lee@mit.edu"
    assert data["user"]["full_name"] == "Jordan Lee"
    assert "password_hash" not in data["user"]

def test_register_duplicate_email_fails(client):
    client.post(
        "/api/auth/register",
        json={
            "full_name": "User One",
            "email": "duplicate@university.edu",
            "password": "password123"
        }
    )
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "User Two",
            "email": "duplicate@university.edu",
            "password": "password123"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()

def test_register_invalid_inputs(client):
    # Short password
    res1 = client.post(
        "/api/auth/register",
        json={"full_name": "Test", "email": "valid@mit.edu", "password": "short"}
    )
    assert res1.status_code == 422

    # Invalid email
    res2 = client.post(
        "/api/auth/register",
        json={"full_name": "Test", "email": "not-an-email", "password": "validpassword123"}
    )
    assert res2.status_code == 422

def test_login_success_and_failure(client):
    # Create account
    client.post(
        "/api/auth/register",
        json={"full_name": "Sam Taylor", "email": "sam@cmu.edu", "password": "mypassword123"}
    )

    # Success login
    res_ok = client.post(
        "/api/auth/login",
        json={"email": "sam@cmu.edu", "password": "mypassword123"}
    )
    assert res_ok.status_code == 200
    assert "access_token" in res_ok.json()

    # Wrong password
    res_bad = client.post(
        "/api/auth/login",
        json={"email": "sam@cmu.edu", "password": "wrongpassword"}
    )
    assert res_bad.status_code == 401

def test_auth_me_authenticated(client):
    reg = client.post(
        "/api/auth/register",
        json={"full_name": "Auth User", "email": "auth.me@berkeley.edu", "password": "password123"}
    ).json()
    token = reg["access_token"]

    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "auth.me@berkeley.edu"

def test_auth_me_unauthorized(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401

def test_inactive_user_access_rejected(client, db_session):
    reg = client.post(
        "/api/auth/register",
        json={"full_name": "Inactive User", "email": "inactive@harvard.edu", "password": "password123"}
    ).json()
    token = reg["access_token"]
    user_id = reg["user"]["id"]

    # Set user active state to False
    user = db_session.query(User).filter(User.id == user_id).first()
    user.is_active = False
    db_session.commit()

    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 403
    assert "inactive" in res.json()["detail"].lower()

def test_logout_endpoint(client):
    reg = client.post(
        "/api/auth/register",
        json={"full_name": "Logout User", "email": "logout@mit.edu", "password": "password123"}
    ).json()
    token = reg["access_token"]

    res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "logged out" in res.json()["message"].lower()
