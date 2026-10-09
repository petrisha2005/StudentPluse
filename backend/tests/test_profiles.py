import pytest

def test_get_and_update_my_profile(client):
    reg = client.post(
        "/api/auth/register",
        json={"full_name": "Profile Tester", "email": "tester@stanford.edu", "password": "password123"}
    ).json()
    token = reg["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch initial profile
    res_get = client.get("/api/profiles/me", headers=headers)
    assert res_get.status_code == 200
    assert res_get.json()["full_name"] == "Profile Tester"

    # Update profile fields, college, skills, and interests
    res_update = client.put(
        "/api/profiles/me",
        headers=headers,
        json={
            "full_name": "Profile Tester Updated",
            "college_name": "Stanford University",
            "degree": "B.S. Computer Science",
            "branch": "Artificial Intelligence",
            "year": "3rd Year",
            "city": "Stanford",
            "bio": "Passionate ML student developer",
            "github_url": "https://github.com/profiletester",
            "skill_ids": [1, 2, 1],  # Test duplicate ID input deduplication
            "interest_ids": [1, 2]
        }
    )
    assert res_update.status_code == 200
    data = res_update.json()
    assert data["full_name"] == "Profile Tester Updated"
    assert data["profile"]["degree"] == "B.S. Computer Science"
    assert data["profile"]["college"]["name"] == "Stanford University"
    assert len(data["skills"]) == 2  # Deduplicated from [1, 2, 1] -> [1, 2]
    assert len(data["interests"]) == 2

def test_get_public_profile_by_id(client):
    reg = client.post(
        "/api/auth/register",
        json={"full_name": "Public Profile", "email": "public@mit.edu", "password": "password123"}
    ).json()
    user_id = reg["user"]["id"]

    res = client.get(f"/api/profiles/{user_id}")
    assert res.status_code == 200
    assert res.json()["full_name"] == "Public Profile"

def test_get_nonexistent_profile_returns_404(client):
    res = client.get("/api/profiles/999999")
    assert res.status_code == 404
