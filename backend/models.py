from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

game_contestants = Table(
    "game_contestants", Base.metadata,
    Column("game_id", Integer, ForeignKey("games.id")),
    Column("contestant_id", Integer, ForeignKey("contestants.id"))
)

class Contestant(Base):
    __tablename__ = "contestants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    upvotes = Column(Integer, default=0)
    contestants = relationship("Contestant", secondary=game_contestants, backref="games")
    popularity_score = Column(Float, default=0)

class Score(Base):
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    contestant_id = Column(Integer, ForeignKey("contestants.id"))
    score = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)
