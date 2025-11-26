from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Body
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session
from datetime import date
from random import shuffle

from models import Base, TeamMember, Pair, Topic, SoloSipper

DATABASE_URL = "sqlite:///./curve_coffee_collab.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://pritish-ranjan01.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# TeamMember CRUD
@app.post("/members/")
def create_member(name: str, email: str, role: str = None, stars_earned: int = 0, db: Session = Depends(get_db)):
    member = TeamMember(name=name, email=email, role=role, stars_earned=stars_earned)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@app.get("/members/")
def list_members(db: Session = Depends(get_db)):
    return db.query(TeamMember).all()

@app.get("/members/{member_id}")
def get_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@app.put("/members/{member_id}")
def update_member(member_id: int, stars_earned: int, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    member.stars_earned = stars_earned
    db.commit()
    return member

@app.delete("/members/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return {"ok": True}

# Pair CRUD
@app.post("/pairs/")
def create_pair(member1_id: int, member2_id: int, week: date, db: Session = Depends(get_db)):
    pair = Pair(member1_id=member1_id, member2_id=member2_id, week=week)
    db.add(pair)
    db.commit()
    db.refresh(pair)
    return pair

@app.get("/pairs/")
def list_pairs(db: Session = Depends(get_db)):
    return db.query(Pair).all()

@app.get("/pairs-with-names")
def get_pairs_with_names(db: Session = Depends(get_db)):
    pairs = db.query(Pair).all()
    result = []
    for pair in pairs:
        member1 = db.query(TeamMember).filter(TeamMember.id == pair.member1_id).first()
        member2 = db.query(TeamMember).filter(TeamMember.id == pair.member2_id).first()
        result.append({
            "id": pair.id,
            "week": pair.week,
            "member1": {"id": member1.id, "name": member1.name},
            "member2": {"id": member2.id, "name": member2.name},
            "member1_attended": pair.member1_attended,
            "member2_attended": pair.member2_attended
        })
    return result

@app.get("/pairs/{pair_id}")
def get_pair(pair_id: int, db: Session = Depends(get_db)):
    pair = db.query(Pair).filter(Pair.id == pair_id).first()
    if not pair:
        raise HTTPException(status_code=404, detail="Pair not found")
    return pair

@app.delete("/pairs/{pair_id}")
def delete_pair(pair_id: int, db: Session = Depends(get_db)):
    pair = db.query(Pair).filter(Pair.id == pair_id).first()
    if not pair:
        raise HTTPException(status_code=404, detail="Pair not found")
    db.delete(pair)
    db.commit()
    return {"ok": True}

from pydantic import BaseModel

class AttendanceUpdate(BaseModel):
    member1_attended: bool
    member2_attended: bool

@app.put("/pairs/{pair_id}/attendance")
def update_attendance(
    pair_id: int,
    attendance: AttendanceUpdate,
    db: Session = Depends(get_db)
):
    pair = db.query(Pair).filter(Pair.id == pair_id).first()
    if not pair:
        raise HTTPException(status_code=404, detail="Pair not found")
    pair.member1_attended = attendance.member1_attended
    pair.member2_attended = attendance.member2_attended
    db.commit()
    db.refresh(pair)
    return pair

@app.get("/topics/")
def list_topics(db: Session = Depends(get_db)):
    return db.query(Topic).all()

@app.get("/solo-sipper-of-the-week")
def get_solo_sipper_of_the_week(db: Session = Depends(get_db)):
    solo = db.query(SoloSipper).order_by(SoloSipper.id.desc()).first()
    if not solo:
        raise HTTPException(status_code=404, detail="No solo sipper found")
    return {"name": solo.name}

@app.get("/leaderboard/")
def get_leaderboard(db: Session = Depends(get_db)):
    # Get all members ordered by stars_earned desc, then name
    members = db.query(TeamMember).order_by(TeamMember.stars_earned.desc(), TeamMember.name).all()
    if not members:
        return []
    # Find the cutoff for top 3 (including ties)
    result = []
    cutoff = 0
    for idx, member in enumerate(members):
        if idx < 3:
            result.append({"name": member.name, "stars_earned": member.stars_earned})
            cutoff = member.stars_earned
        elif member.stars_earned == cutoff:
            result.append({"name": member.name, "stars_earned": member.stars_earned})
        else:
            break
    return result

@app.post("/shuffle-pairs")
def shuffle_pairs(db: Session = Depends(get_db)):
    # Clear existing pairs and solo sipper
    db.query(Pair).delete()
    db.query(SoloSipper).delete()
    db.commit()

    # Get all team members
    members = db.query(TeamMember).all()
    member_ids = [m.id for m in members]
    shuffle(member_ids)

    today = date.today()
    pairs = []
    solo = None
    # Pair up members
    for i in range(0, len(member_ids) - 1, 2):
        pair = Pair(
            member1_id=member_ids[i],
            member2_id=member_ids[i+1],
            week=today,
            member1_attended=False,
            member2_attended=False
        )
        db.add(pair)
        pairs.append(pair)
    # If odd member, add to solo sipper
    if len(member_ids) % 2 == 1:
        solo_member = db.query(TeamMember).filter(TeamMember.id == member_ids[-1]).first()
        if solo_member:
            solo = SoloSipper(name=solo_member.name, email=solo_member.email)
            db.add(solo)
    db.commit()
    return {"ok": True, "pairs_created": len(pairs), "solo_sipper": solo.name if solo else None}