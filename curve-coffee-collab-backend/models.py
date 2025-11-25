from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class TeamMember(Base):
    __tablename__ = "team_members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=True)
    stars_earned = Column(Integer, default=0)
    pairs = relationship("Pair", back_populates="member1", foreign_keys='Pair.member1_id')
    pairs2 = relationship("Pair", back_populates="member2", foreign_keys='Pair.member2_id')

class Pair(Base):
    __tablename__ = "pairs"
    id = Column(Integer, primary_key=True, index=True)
    member1_id = Column(Integer, ForeignKey("team_members.id"), nullable=False)
    member2_id = Column(Integer, ForeignKey("team_members.id"), nullable=False)
    week = Column(Date, nullable=False)
    member1 = relationship("TeamMember", foreign_keys=[member1_id], back_populates="pairs")
    member2 = relationship("TeamMember", foreign_keys=[member2_id], back_populates="pairs2")
    member1_attended = Column(Boolean, default=False)
    member2_attended = Column(Boolean, default=False)


class SoloSipper(Base):
    __tablename__ = "solo_sipper"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(Text, nullable=False)
