from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session
from datetime import date
from models import Base, TeamMember, Pair

DATABASE_URL = "sqlite:///./curve_coffee_collab.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

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
