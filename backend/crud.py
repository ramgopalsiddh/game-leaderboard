from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Contestant, Game, Score
from datetime import datetime, timedelta

def create_contestant(db: Session, name: str, email: str):
    new_contestant = Contestant(name=name, email=email)
    db.add(new_contestant)
    db.commit()
    db.refresh(new_contestant)
    return new_contestant

def update_contestant(db: Session, contestant_id: int, name: str, email: str):
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()
    if contestant:
        contestant.name = name
        contestant.email = email
        db.commit()
        return contestant
    return None

def delete_contestant(db: Session, contestant_id: int):
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()
    if contestant:
        db.delete(contestant)
        db.commit()
        return True
    return False

def create_game(db: Session, name: str, description: str = ""):
    new_game = Game(name=name, description=description)
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game

def start_game(db: Session, game_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    if game:
        game.start_time = datetime.now()
        db.commit()
    return game

def end_game(db: Session, game_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    if game:
        game.end_time = datetime.now()
        db.commit()
        db.refresh(game)
        return game
    return None

def enter_game(db: Session, game_id: int, contestant_id: int):
    # Find the game and contestant
    game = db.query(Game).filter(Game.id == game_id).first()
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()
    
    if game and contestant:
        # Add contestant to the game
        game.contestants.append(contestant)
        db.commit()
        db.refresh(game)
        return {"message": f"Contestant {contestant.name} entered the game {game.name}"}
    return None

def exit_game(db: Session, game_id: int, contestant_id: int):
    # Find the game and contestant
    game = db.query(Game).filter(Game.id == game_id).first()
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()
    
    if game and contestant:
        # Remove contestant from the game
        game.contestants.remove(contestant)
        db.commit()
        db.refresh(game)
        return {"message": f"Contestant {contestant.name} exited the game {game.name}"}
    return None


def assign_score(db: Session, game_id: int, contestant_id: int, score: int):
    new_score = Score(game_id=game_id, contestant_id=contestant_id, score=score)
    db.add(new_score)
    db.commit()
    return new_score

def get_leaderboard(db: Session, game_id: int = None):
    query = db.query(Score)
    if game_id:
        query = query.filter(Score.game_id == game_id)
    return query.order_by(Score.score.desc()).all()

def update_popularity_score(db: Session):
    yesterday = datetime.utcnow() - timedelta(days=1)

    # Dynamic calculations for max values
    max_w1 = db.query(Score.game_id, Score.contestant_id).filter(Score.timestamp >= yesterday).distinct().count()
    max_w2 = db.query(Score.game_id, Score.contestant_id).filter(Score.timestamp >= datetime.now()).distinct().count()
    max_w3 = db.query(Game).with_entities(Game.id, func.max(Game.upvotes)).scalar()  # Max upvotes
    max_w4 = db.query(Game).with_entities(Game.id, func.max(func.extract('epoch', Game.end_time) - func.extract('epoch', Game.start_time))).filter(Game.start_time >= yesterday).scalar()  # Max session length
    max_w5 = db.query(Score.game_id).filter(Score.timestamp >= yesterday).distinct().count()  # Max number of sessions played

    # Loop through all games
    games = db.query(Game).all()

    for game in games:
        # Calculate w1, w2, w3, w4, w5 for each game
        w1 = db.query(Score).filter(Score.game_id == game.id, Score.timestamp >= yesterday).count()
        w2 = db.query(Score).filter(Score.game_id == game.id, Score.timestamp >= datetime.now()).count()
        w3 = game.upvotes
        w4 = (func.extract('epoch', game.end_time) - func.extract('epoch', game.start_time)) if game.start_time and game.end_time else 0
        w5 = db.query(Score).filter(Score.game_id == game.id, Score.timestamp >= yesterday).count()

        # Normalize and calculate popularity score
        game.popularity_score = (
            0.3 * (w1 / max_w1 if max_w1 else 1) +
            0.2 * (w2 / max_w2 if max_w2 else 1) +
            0.25 * (w3 / max_w3 if max_w3 else 1) +
            0.15 * (w4 / max_w4 if max_w4 else 1) +
            0.1 * (w5 / max_w5 if max_w5 else 1)
        )
        db.commit()

