import pytest

def test_list_skills(client):
    res = client.get("/api/skills")
    assert res.status_code == 200
    skills = res.json()
    assert isinstance(skills, list)
    assert len(skills) > 0
    skill_names = [s["name"] for s in skills]
    assert "React.js" in skill_names
    assert "Python" in skill_names

def test_list_interests(client):
    res = client.get("/api/interests")
    assert res.status_code == 200
    interests = res.json()
    assert isinstance(interests, list)
    assert len(interests) > 0
    interest_names = [i["name"] for i in interests]
    assert "Hackathons" in interest_names

def test_list_colleges(client):
    res = client.get("/api/colleges")
    assert res.status_code == 200
    colleges = res.json()
    assert isinstance(colleges, list)
    assert len(colleges) > 0

def test_list_users_discovery(client):
    res = client.get("/api/users")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
