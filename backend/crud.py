from sqlalchemy.orm import Session
from models import Contestant, Game, Score
from datetime import datetime

def create_contestant(db: Session, name: str, email: str):
    new_contestant = Contestant(name=name, email=email)
    db.add(new_contestant)
    db.commit()
    db.refresh(new_contestant)
    return new_contestant

def create_game(db: Session, name: str, description: str = ""):
    new_game = Game(name=name, description=description)
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game

def start_game(db: Session, game_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        return None
    game.start_time = datetime.utcnow()
    db.commit()
    return game

def end_game(db: Session, game_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        return None
    game.end_time = datetime.utcnow()
    db.commit()
    return game

def assign_score(db: Session, game_id: int, contestant_id: int, score: int):
    new_score = Score(game_id=game_id, contestant_id=contestant_id, score=score)
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score

def get_leaderboard(db: Session, game_id: int = None):
    query = db.query(Score)
    if game_id:
        query = query.filter(Score.game_id == game_id)
    return query.order_by(Score.score.desc()).all()
