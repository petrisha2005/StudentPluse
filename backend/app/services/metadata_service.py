from typing import List
from sqlalchemy.orm import Session
from app.models.skill import Skill
from app.models.interest import Interest
from app.models.college import College

INITIAL_SKILLS = [
    {"name": "React.js", "category": "Frontend"},
    {"name": "TypeScript", "category": "Frontend"},
    {"name": "Node.js", "category": "Backend"},
    {"name": "Python", "category": "Backend"},
    {"name": "FastAPI", "category": "Backend"},
    {"name": "PostgreSQL", "category": "Database"},
    {"name": "UI/UX Design", "category": "Design"},
    {"name": "Figma", "category": "Design"},
    {"name": "Machine Learning", "category": "AI/ML"},
    {"name": "PyTorch", "category": "AI/ML"},
    {"name": "Tailwind CSS", "category": "Frontend"},
    {"name": "Docker", "category": "DevOps"},
    {"name": "Git & GitHub", "category": "DevOps"},
    {"name": "Product Management", "category": "Management"},
]

INITIAL_INTERESTS = [
    {"name": "Hackathons", "category": "Events"},
    {"name": "Open Source", "category": "Development"},
    {"name": "AI & Generative Tech", "category": "Technology"},
    {"name": "Web3 & Blockchain", "category": "Technology"},
    {"name": "Mobile App Development", "category": "Development"},
    {"name": "Startup Incubators", "category": "Entrepreneurship"},
    {"name": "Competitive Programming", "category": "Coding"},
    {"name": "Cybersecurity", "category": "Security"},
]

INITIAL_COLLEGES = [
    {"name": "Stanford University", "city": "Stanford", "state": "CA", "website": "https://stanford.edu"},
    {"name": "Massachusetts Institute of Technology (MIT)", "city": "Cambridge", "state": "MA", "website": "https://mit.edu"},
    {"name": "Harvard University", "city": "Cambridge", "state": "MA", "website": "https://harvard.edu"},
    {"name": "University of California, Berkeley", "city": "Berkeley", "state": "CA", "website": "https://berkeley.edu"},
    {"name": "Carnegie Mellon University", "city": "Pittsburgh", "state": "PA", "website": "https://cmu.edu"},
    {"name": "Indian Institute of Technology (IIT) Bombay", "city": "Mumbai", "state": "MH", "website": "https://iitb.ac.in"},
    {"name": "Indian Institute of Technology (IIT) Delhi", "city": "New Delhi", "state": "DL", "website": "https://iitd.ac.in"},
]

def seed_initial_metadata(db: Session):
    for item in INITIAL_SKILLS:
        if not db.query(Skill).filter(Skill.name == item["name"]).first():
            db.add(Skill(name=item["name"], category=item["category"]))

    for item in INITIAL_INTERESTS:
        if not db.query(Interest).filter(Interest.name == item["name"]).first():
            db.add(Interest(name=item["name"], category=item["category"]))

    for item in INITIAL_COLLEGES:
        if not db.query(College).filter(College.name == item["name"]).first():
            db.add(College(name=item["name"], city=item["city"], state=item["state"], website=item["website"]))

    db.commit()

def get_all_skills(db: Session) -> List[Skill]:
    return db.query(Skill).order_by(Skill.category, Skill.name).all()

def get_all_interests(db: Session) -> List[Interest]:
    return db.query(Interest).order_by(Interest.category, Interest.name).all()

def get_all_colleges(db: Session) -> List[College]:
    return db.query(College).order_by(College.name).all()
